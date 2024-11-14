const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

module.exports = async function optimizeSVG(filePath) {
    try {
        const svgData = fs.readFileSync(filePath, 'utf8');
        const result = optimize(svgData, {
            path: filePath,
            multipass: true,
            floatPrecision: 4,
            plugins: [
                { name: 'removeDoctype' },
                { name: 'removeComments' },
                { name: 'removeMetadata' },
                { name: 'removeEditorsNSData' },
                { name: 'cleanupAttrs' },
                { name: 'mergeStyles' },
                { name: 'inlineStyles' },
                { name: 'minifyStyles' },
                { name: 'convertStyleToAttrs' },
                { name: 'cleanupIds' },
                { name: 'removeRasterImages' },
                { name: 'removeUselessDefs' },
                { name: 'convertPathData', params: { floatPrecision: 4 } },
                { name: 'convertTransform', params: { floatPrecision: 4 } },
                { name: 'convertColors' },
                { name: 'removeUnknownsAndDefaults' },
                { name: 'removeNonInheritableGroupAttrs' },
                { name: 'removeUselessStrokeAndFill' },
                { name: 'removeViewBox' },
                { name: 'cleanupEnableBackground' },
                { name: 'removeHiddenElems' },
                { name: 'removeEmptyText' },
                { name: 'convertShapeToPath' },
                { name: 'moveElemsAttrsToGroup' },
                { name: 'moveGroupAttrsToElems' },
                { name: 'collapseGroups' },
                { name: 'convertEllipseToCircle' },
                { name: 'removeEmptyContainers' },
                { name: 'mergePaths' },
                { name: 'removeUnusedNS' },
                { name: 'reusePaths' },
                { name: 'sortAttrs' },
                { name: 'sortDefsChildren' },
                { name: 'removeTitle' },
                { name: 'removeDesc' },
                { name: 'removeDimensions' },
                { name: 'removeStyleElement' },
                { name: 'removeScriptElement' }
            ]
        });

        fs.writeFileSync(filePath, result.data);
        console.log(`SVG optimized: ${filePath}`);
    } catch (err) {
        console.error(`Error optimizing SVG: ${filePath}`, err);
    };
};