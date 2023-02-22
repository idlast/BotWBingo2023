import pandas as pd

df = pd.read_excel('bingo.xlsx')
dfcsv = df.to_csv(index=False,header=False)
#with open("./bingo.js", encoding='utf-8') as f:
strline = dfcsv.split("\n")
strdf = str(strline)
text = ""
resultList = [[]]
for num in range(24):
    resultList.append([])

for line in strline:
    if line == '':
        break
    text = ""
    line = line.partition(",,")[0]
    line = line.replace("\r", "")
    text = text + "{"
    row = line.split(",")
    i = 0
    rank = 0
    for word in row:
        if(i == 0):
            text = text + "\"name\": \"" + word + "\"" + ", "
        elif(i == 1):
            text = text + "\"en\": \"" + word + "\"" + ", "
        elif(i == 2):
            rank = int(word)
        elif(i == 3):
            text = text + "\"types\": [ \"" + word+ "\"" + ", "
        else:
            text = text + "\"" + word + "\", "
        i = i + 1
    text = text[:-2]
    text = text + "] },\n"
    resultList[rank-1].append(text)
    
header = "var bingoList = [\n[\n"
aider = "], [\n"
footer = "]\n]; "
finalizedText = header

for result in resultList:
    for resultText in result:
        finalizedText = finalizedText + resultText
    finalizedText = finalizedText + aider

finalizedText = finalizedText[:-5]
finalizedText = finalizedText + footer
print("C:"+finalizedText)
