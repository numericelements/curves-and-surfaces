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

def get_prefix(filepath):
    parts = filepath.split("/")
    depth = len(parts) - 1  # number of directory levels
    prefix = "../" * (depth - 1) + "src/mathVector"
    return prefix

def make_import_lines(needs, prefix):
    lines = []
    for sym in needs:
        if sym == "createRealVectorSpace":
            lines.append('import { createRealVectorSpace } from "' + prefix + '/VectorSpaceFactory";')
        else:
            lines.append('import { ' + sym + ' } from "' + prefix + '/' + sym + '";')
    return lines

for filepath, needs in files_needs.items():
    prefix = get_prefix(filepath)
    import_lines = make_import_lines(needs, prefix)
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
    
    if last_import_idx == -1:
        new_content = '\n'.join(import_lines) + '\n' + content
    else:
        lines_out = lines[:last_import_idx + 1] + import_lines + lines[last_import_idx + 1:]
        new_content = '\n'.join(lines_out)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print("Updated: " + filepath)

print("Done!")
