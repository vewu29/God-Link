import docx,json,re
d=docx.Document('/home/hatch/workspace/user/files/English___Book__1.docx')
ps=d.paragraphs
def kind(p):
    if not p.runs: return None
    if any((r.font.name or '')=='Consolas' for r in p.runs):
        cols=[str(r.font.color.rgb) if r.font.color and r.font.color.type else None for r in p.runs if r.text.strip()]
        if cols and all(c=='9DFF8A' for c in cols): return 'out'
        return 'code'
    return None
ch=None;items=[];prev=None;started=False
for i,p in enumerate(ps):
    if p.style.name=='Heading 1':
        ch=p.text.strip(); started=True; continue
    if not started: continue
    k=kind(p)
    if k=='code':
        prev=(i,p.text)
        allc=items
    elif k=='out' and prev and prev[0]==i-1:
        items.append({'id':len(items),'para':prev[0],'chapter':ch,'code':prev[1],'output':p.text})
        prev=None
    elif k is None and p.text.strip()=='' : pass
    else:
        if k is None: prev=None
json.dump(items,open('book_corpus.json','w'),indent=1)
import collections
c=collections.Counter(x['chapter'] for x in items)
print(len(items))
for k,v in c.items(): print(v,k)
