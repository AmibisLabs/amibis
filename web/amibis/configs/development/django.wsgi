import os
import sys

# Calculate the path based on the location of the WSGI script.
development = os.path.dirname(__file__)
settings = os.path.dirname(development)
project = os.path.dirname(settings)
workspace = os.path.dirname(project)
sys.path.append(workspace)

import django.core.handlers.wsgi

os.environ['PYTHON_EGG_CACHE'] = project+'/.python-eggs'
os.environ['DJANGO_SETTINGS_MODULE'] = 'omiscid.configs.development.settings'

application = django.core.handlers.wsgi.WSGIHandler()
