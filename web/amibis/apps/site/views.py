#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import sys
from django.http import HttpResponse
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext

def index(request):
    return HttpResponse("Hello, world. You're at the poll index.")