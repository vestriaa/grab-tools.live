import os

def find_sgm_files(directory):
    sgm_files = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".sgm"):
                sgm_files.append(os.path.join(root, file))
    return sgm_files

# Example usage
directory = "sgms/angel-devil-pack"
sgm_files = find_sgm_files(directory)
for file in sgm_files:
    file = file.replace("\\", "/")
    filename = file.split("/")[-1]
    os.system("python \"C:/Users/tom.lynch/3D Objects/p/Rayne-SGM-to-OBJ/sgm2obj.py\" " + file + " public/models/" + filename + ".obj")
    print(filename+'.obj')
    