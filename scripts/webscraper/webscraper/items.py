# -*- coding: utf-8 -*-
import scrapy

class Place(scrapy.Item):
    name = Field()
    menu_items = Field()
    info = Field()
