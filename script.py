import os
import json
import re
def parse_imports(file_path):
    abs_file_path = os.path.abspath(file_path)

    if abs_file_path.endswith(".js") or abs_file_path.endswith(".jsx"):
        if abs_file_path.endswith(".js"):
            abs_file_path = abs_file_path.strip(".js")
        if abs_file_path.endswith(".jsx"):
            abs_file_path = abs_file_path.strip(".jsx")
        result = {
            abs_file_path: []
        }
        with open(file_path, "r") as f:
            lines = f.readlines()
            for line in lines:
                if line.startswith("import"):
                    import_path = ""
                    if "from" in line:
                        newImpArr = re.findall(r'([^\.]*)', line)
                        if(len(newImpArr) == 0):
                             continue

                        import_path = line.split(" from ")[-1]
                    else:
                        import_path = line.split("import ")[-1]

                    if '"' in import_path:
                        import_path = import_path.strip('"')
                    if "'" in import_path:
                        import_path = import_path.strip("'")
                    # print('import_path ', import_path)
                    if import_path.startswith("."):
                        import_path = import_path.strip()
                        import_path = import_path.strip(";")
                        import_path = import_path.strip("'")
                        import_path = import_path.strip('"')
                        imp_arr = import_path.split('/')
                        abs_import_path = os.path.realpath(import_path)
                        if(len(imp_arr) > 0):
                            result[abs_file_path].append(imp_arr[len(imp_arr) -1])

        return result


def walk_directory(path):
    data = {}
    for dirpath, _, filenames in os.walk(path):
        for file in filenames:
            full_path = dirpath + "/" + file
            file = file.strip("'");
            file = re.findall(r'([^\.]*)', file)
            result = parse_imports(full_path)
            if result:
                for key, value in result.items():
                    data[file[0]] = value
    return data

if __name__ == '__main__':
    data = walk_directory("./DeviceDetails")
    print(json.dumps(data, indent="\t")) 