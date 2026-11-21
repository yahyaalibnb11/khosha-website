import glob,os
d=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));head=open(os.path.dirname(os.path.abspath(__file__))+'/_head.html').read()
for f in [x for x in glob.glob(d+'/src/*.html') if not os.path.basename(x).startswith('_')]:
    open(d+'/'+os.path.basename(f),'w').write(open(f).read().replace('@@HEAD@@',head))
print('built')
