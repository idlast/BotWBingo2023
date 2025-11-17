import re
import json
import pandas as pd

js_path = r"tables/botwBingo2023_with_weights.js"
output_path = r"exported_tasks.csv"

with open(js_path, 'r', encoding='utf-8') as f:
    js_content = f.read()

pattern = r'\{\s*"name":\s*"([^"]+)",\s*"en":\s*"([^"]+)",\s*"difficulty":\s*([\d.]+),\s*"types":\s*(\[[^\]]+\])\s*\}'

tasks = []
for match in re.finditer(pattern, js_content):
    name = match.group(1)
    en = match.group(2)
    difficulty = float(match.group(3))
    types = match.group(4)
    
    tasks.append({
        '元からあるタスク': name,
        '英語名': en,
        '重さ': difficulty,
        'types': types
    })

df = pd.DataFrame(tasks)
df = df.sort_values('元からあるタスク').reset_index(drop=True)

df.to_csv(output_path, index=False, encoding='utf-8')

print(f"JS → CSV 変換完了: {len(tasks)} タスク")
print(f"出力: {output_path}")
