# -*- coding: utf-8 -*-
import scrapy


class PlacesSpider(scrapy.Spider):
    name = 'places'
    allowed_domains = ['kingofhappyhour.com']

    def start_requests(self):
        url = 'https://kingofhappyhour.com/sandiego'
        yield scrapy.Request(url=url, callback=self.parse_neighborhoods, meta={'dont_redirect': True, 'handle_httpstatus_list': [302, 301]})

    def parse_neighborhoods(self, response):
        links = response.css('ul.dropdown-menu li a::attr(href)').extract()
        base_url = 'https://kingofhappyhour.com'
        for link in links:
            yield scrapy.Request(url=base_url+link, callback=self.parse_bars, meta={'dont_redirect': True, 'handle_httpstatus_list': [301, 302]})

    def parse_bars(self, response):
        links = response.css('a.bar_name::attr(href)').extract()
        base_url = 'https://kingofhappyhour.com'
        for link in links:
            yield scrapy.Request(url=base_url+link, callback=self.parse_bar, meta={'dont_redirect': True, 'handle_httpstatus_list': [302, 301]})

    def parse_bar(self, response):
        days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        info = response.css('#bar-info-table td.small-caps::text').extract()
        info = self.__format_info(info, '\n')

        address = f'{info[0]}, {info[1]}'
        phone_number = info[2]
        name = response.css('#bar-info-table h3::text').extract()[0]
        bar = { 'name': name, 'address': address, 'phone_number': phone_number }

        daily_specials = {}
        for day in days:
            headings = response.css(self.__css_selector(day, 'strong.heading::text')).extract()
            headings = self.__format_info(headings, ':')

            specials = []
            for i, heading in enumerate(headings):
                time = response.xpath(self.__xpath_times_selector(day, heading)).extract()

                if heading == 'Taco Tuesday Specials':
                    special = response.xpath(self.__xpath_taco_selector(day)).extract()
                    time, special = [[special[0]], special[1:]]
                else:
                    special = response.xpath(self.__xpath_special_selector(day, i+1)).extract()

                special = '\n '.join(special)
                time = self.__format_info(time, '\n')

                specials_obj = {
                    'specials_type': heading,
                    'specials': special,
                    'time': time[0]
                }
                specials.append(specials_obj)

            daily_specials[day] = specials

        bar['daily_specials'] = daily_specials

        yield bar


    ### Helper Functions ###
    def __format_info(self, info, delimiter):
        new_info = []
        for i in info:
            i = i.replace(delimiter, '')
            i = i.strip()
            new_info.append(i)

        return new_info

    def __css_selector(self, day, element):
        daily_special_selector = '#daily_special-'+day
        return f'{daily_special_selector} {element}'

    def __xpath_times_selector(self, day, heading):
        time_selector = f'//div[@id="daily_special-{day}"]//strong[text()="{heading}:"]//following-sibling::text()[1]'
        return time_selector

    def __xpath_special_selector(self, day, index):
        daily_special_selector = f'//div[@id="daily_special-{day}"]//p[count(preceding-sibling::strong[@class="heading"])={index}]//text()'
        return daily_special_selector

    def __xpath_taco_selector(self, day):
        taco_selector = f'//div[@class="taco_tuesday"]//p//text()'
        return taco_selector
