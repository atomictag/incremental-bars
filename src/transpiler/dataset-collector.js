var _ = require('underscore')._;

var Utils = require('./shared/utils');
var Opcodes = require('./shared/opcodes');

// ============================================
// allow datasets around text blocks instead of collecting them in the parent?
var ALLOW_TEXT_DATASETS = true;
// ============================================

// DatasetCollector
var DatasetCollector = function(level, elementOpen, openIndex) {
    this.level    = level;
    this.children = [];
    this.open(elementOpen, openIndex);
}
DatasetCollector.prototype.open = function(elementOpen, openIndex) {
    this.elementOpen         = elementOpen;
    this.levelOpenIndex      = openIndex;
    this.collectedDatasets   = undefined;
    this.collect(elementOpen);
};
DatasetCollector.prototype.purgeChildrenDatasets = function(datasets) {
    var parentDatasets = datasets || this.collectedDatasets;
    _.each(this.children, function(child) {
        var childDatasets = child.collectedDatasets;
        Utils.purgeChildDatasets(parentDatasets, childDatasets);
        child.purgeChildrenDatasets(parentDatasets);
    });
}
DatasetCollector.prototype.close = function(elementClose, closeIndex) {
    this.elementClose    = elementClose;
    this.levelCloseIndex = closeIndex;
    // optimise elementVoid
    if(elementClose !== this.elementOpen) {
        this.collect(elementClose);
    }
    // remove datasets entries from children when they are superceded by the parent
    this.purgeChildrenDatasets();
    // Compact datasets
    Utils.compactDatasets(this.collectedDatasets);
    return this.parent;
};
DatasetCollector.prototype.collect = function(desc) {
    this.collectedDatasets  = this.collectedDatasets || {};
    this.collectedDatasets  = Utils.mergeDatasets(this.collectedDatasets, desc.datasets, false);
}
DatasetCollector.prototype.addChild = function(level, elementOpen, openIndex) {
    var child = new DatasetCollector(level, elementOpen, openIndex);
    this.children.push(child);
    child.parent = this;
    return child;
}
DatasetCollector.prototype.dump = function() {
    if(!_.isEmpty(this.collectedDatasets)) {
        console.log(new Array(this.level * 2).join('\t'),'level',this.level,'would add dataset before', this.levelOpenIndex,'and after', this.levelCloseIndex, Utils.formatDatasets(this.collectedDatasets));
    } else {
        console.log(new Array(this.level * 2).join('\t'),'level',this.level,'has no datasets to add');
    }
    _.each(this.children, function(child) { child.dump(); });
},
DatasetCollector.prototype.getPatch = function() {
    var patch = {};
    if(!_.isEmpty(this.collectedDatasets)) {
        patch[this.levelOpenIndex]  = { datasetOpen : true, datasets : this.collectedDatasets, level : this.level };
        // Handle cases where levelOpenIndex === levelCloseIndex
        patch[this.levelCloseIndex] = _.extend(patch[this.levelCloseIndex] || {}, { datasetClose : true });
    }
    _.each(this.children, function(child) {
        patch = _.extend(patch, child.getPatch());
    });
    return patch;
}
DatasetCollector.process = function(descriptors) {
    var currentLevel   = 0;
    var currentHead    = undefined;
    var roots = [], patches = {};
    var openOpcodes = [ Opcodes.ELEMENT_OPEN, Opcodes.ELEMENT_OPEN_START, Opcodes.ELEMENT_VOID];
    // allow datasets around text blocks instead of collecting them in the parent?
    if(ALLOW_TEXT_DATASETS) {
        openOpcodes.push(Opcodes.TEXT);
    }
    var iterator = function (desc, index) {
        var opcode = desc.opcode;
        if(openOpcodes.indexOf(opcode) !== -1) {
            if(currentLevel === 0) {
                currentHead = new DatasetCollector(0, desc, index);
                roots.push(currentHead);
                ++currentLevel;
            } else {
                currentHead = currentHead.addChild(currentLevel, desc, index);
                ++currentLevel;
            }
            if(Opcodes.ELEMENT_VOID === opcode || Opcodes.TEXT === opcode ) {
                --currentLevel;
                currentHead = currentHead.close(desc, index);
            }
        } else if(Opcodes.ELEMENT_CLOSE === opcode) {
            --currentLevel;
            currentHead = currentHead.close(desc, index);
        } else {
            if(!currentHead && !_.isEmpty(desc.datasets)) {
                // This is a text or a control outside of a root (i.e. at level 0).
                // In the former case (only if 'text' opcodes are not treated as 'openOpcodes')
                // we can add a new root and add the descriptor with all text to it.
                // In the latter case we would have to find the closing control moustache
                // which is not all that trivial and probably useful only for (some) partials.
                // For those cases simple changes to the template are sufficient to fix the issue.
                if(desc.opcode === Opcodes.CONTROL) {
                    throw new Error('Control blocks with datasets are not allowed at level 0');
                }
                currentHead = new DatasetCollector(0, desc, index);
                roots.push(currentHead);
                currentHead = currentHead.close(desc, index);
            } else if(!_.isEmpty(desc.datasets)) {
                // Collect dataset
                currentHead.collect(desc);
            }
        }
    }

    // Scan descriptors and create roots
    _.each(descriptors, iterator);

    // Accumulate roots into patches
    _.each(roots, function(root) {
        // root.dump();
        patches = _.extend(patches, root.getPatch());
    });

    // Return patches
    return patches;
};

module.exports = {
    process : DatasetCollector.process
};