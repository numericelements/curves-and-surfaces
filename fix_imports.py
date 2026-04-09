import os
import re

files_needs = {
    "test/mathVector/changeVectorSpaceType/fromProjectiveReal2DToReal2D.ts": ["createRealVectorSpace"],
    "test/mathVector/changeVectorSpaceType/fromProjectiveReal3DToReal3D.ts": ["createRealVectorSpace"],
    "test/mathVector/ComplexVectorSpace.ts": ["RealVectorSpace2D"],
    "test/mathVector/internal/DefaultSpaceResolvers.ts": ["createRealVectorSpace"],
    "test/mathVector/internal/DefaultVectorSpaces.ts": ["createRealVectorSpace", "RealVectorSpace1D", "RealVectorSpace2D"],
    "test/mathVector/internal/VectorSpaceIdentifierManager.ts": ["RealVectorSpace1D", "RealVectorSpace2D"],
    "test/mathVector/internal/VectorSpaceResolvers.ts": ["createRealVectorSpace"],
    "test/mathVector/ProjectiveComplexVectorSpace.ts": ["RealVectorSpace2D", "RealVectorSpace3D"],
    "test/mathVector/ProjectiveRealVectorSpace.ts": ["RealVectorSpace3D", "RealVectorSpace4D"],
    "test/mathVector/ProjectiveVector1DComplex.ts": ["createRealVectorSpace"],
    "test/mathVector/ProjectiveVector2DReal.ts": ["createRealVectorSpace", "RealVectorSpace2D", "RealVectorSpace3D"],
    "test/mathVector/ProjectiveVector3DReal.ts": ["createRealVectorSpace", "RealVectorSpace3D", "RealVectorSpace4D"],
    "test/mathVector/RealVectorsIntoDefaultVectorSpaces.ts": ["createRealVectorSpace"],
    "test/mathVector/Vector.ts": ["RealVectorSpace2D"],
    "test/mathVector/Vector1DComplex.ts": ["createRealVectorSpace", "RealVectorSpace2D", "RealVectorSpace3D"],
    "test/mathVector/Vector1DReal.ts": ["createRealVectorSpace", "RealVectorSpace3D"],
    "test/mathVector/Vector2DComplex.ts": ["createRealVectorSpace", "RealVectorSpace2D", "RealVectorSpace3D", "RealVectorSpace4D"],
    "test/mathVector/Vector2DReal.ts": ["createRealVectorSpace", "RealVectorSpace3D"],
    "test/mathVector/Vector3DReal.ts": ["createRealVectorSpace", "RealVectorSpace2D"],
    "test/mathVector/Vector4DReal.ts": ["createRealVectorSpace", "RealVectorSpace2D"],
    "test/mathVector/VectorCollection1D.ts": ["RealVectorSpace2D", "RealVectorSpace3D"],
    "test/mathVector/VectorDescriptorCollection1D.ts": ["RealVectorSpace1D", "RealVectorSpace2D", "RealVectorSpace3D", "RealVectorSpace4D"],
    "test/mathVector/VectorFactory.ts": ["createRealVectorSpace"],
    "test/mathVector/VectorFromDescriptorFactory.ts": ["RealVectorSpace1D", "RealVectorSpace2D", "RealVectorSpace3D", "RealVectorSpace4D"],
}

# Symbols that may have been added with bad imports
new_symbols = {"createRealVectorSpace", "RealVectorSpace1D", "RealVectorSpace2D", "RealVectorSpace3D", "RealVectorSpace4D"}

def get_correct_path(filepath):
    # Count directory depth: test/mathVector/file.ts -> depth=2 -> "../../"
    parts = filepath.split("/")
    num_dirs = len(parts) - 1  # exclude file name
    return "../" * num_dirs + "src/mathVector"

def make_import_line(sym, prefix):
    if sym == "createRealVectorSpace":
        return 'import { createRealVectorSpace } from "' + prefix + '/VectorSpaceFactory";'
    else:
        return 'import { ' + sym + ' } from "' + prefix + '/' + sym + '";'

def is_new_symbol_import(line):
    for sym in new_symbols:
        if sym in line and line.startswith("import"):
            return True
    return False

for filepath, needs in files_needs.items():
    prefix = get_correct_path(filepath)
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Remove any existing (possibly wrong/duplicate) imports of the new symbols
    filtered_lines = [line for line in lines if not is_new_symbol_import(line)]
    
    # Find the last existing import line in already-filtered content
    last_import_idx = -1
    for i, line in enumerate(filtered_lines):
        if line.startswith('import '):
            last_import_idx = i
    
    # Build new import lines with correct paths
    import_lines = [make_import_line(sym, prefix) for sym in needs]
    
    if last_import_idx == -1:
        lines_out = import_lines + filtered_lines
    else:
        lines_out = filtered_lines[:last_import_idx + 1] + import_lines + filtered_lines[last_import_idx + 1:]
    
    new_content = '\n'.join(lines_out)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print("Updated: " + filepath + " (path prefix: " + prefix + ")")

print("Done!")
