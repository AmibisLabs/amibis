import os,sys
import django.core.handlers.wsgi

apache_configuration= os.path.dirname(__file__)
project = os.path.dirname(apache_configuration)
workspace = os.path.dirname(project)
sys.path.append(workspace)

def application(environ, start_response):
    start_response('200 OK', [('content-Type', 'text/html')])
    output = "<h1>sys.path</h1><br/>"
    for x in sys.path:
        output = output+x+"<br>"
    output = output+"<h1>os.environ</h1><br/>"
    for x in environ:
        output = output+x+"<br>"

    return [output]
