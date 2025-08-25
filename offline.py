import os
import base64

def processCoresDir(coresDirPath):
    jsFiles = []
    wasmFiles = []

    coresDir = os.listdir("cores/")
    print(f"Processing {len(coresDir)} files.")

    for fileName in coresDir:
        if fileName.endswith(".js"):
            jsFiles.append(fileName)
        elif fileName.endswith(".wasm"):
            wasmFiles.append(fileName)
        else:
            print(f"Unsupported File: {fileName}({fileName.split(".")[-1]})")

    return jsFiles, wasmFiles

def encodeFile(baseDirPath, inputFileName, outputFileDir):
    inputFileDir = baseDirPath + inputFileName
    outputFileDir = baseDirPath + outputFileName
    print(f"encoding {inputFileDir} then appending var to corresponding {outputFileDir}")

    if os.path.isfile(inputFileDir):
        with open(inputFileDir, "rb") as inputFile:
            fileData = inputFile.read()
            base64Data = base64.b64encode(fileData).decode('utf-8')
            dataArray = {
                'filename': inputFileName
                'base64': base64_data
            }
        dataRaw = "\n".join([f"--file {file_data['filename']}\n{file_data['base64']}\n" 
                                  for file_data in base64_data_array])

        #IMPLEMENT FETCH INJECT
        snippet = f"<script src={}</script>"

        output_file_path = os.path.join(output_dir, "encoded_files.TESTING")
        with open(output_file_path, "w") as output_file:
            output_file.write(blob_content)

        # Log the final output details
        print(f"Encoded and written all Data to: {output_file_path} ({len(blob_content)})")

coresDirPath = "cores/"
jsFiles, wasmFiles = processCoresDir(coresDirPath)

for wasmFileName in wasmFiles:
    correspondingJsFile = jsFiles[wasmFiles.index(wasmFileName)]
    encodeFile(coresDirPath, wasmFileName, correspondingJsFile)
