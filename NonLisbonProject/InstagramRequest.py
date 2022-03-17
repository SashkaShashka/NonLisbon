import sys
import random
import string
from instagramy import InstagramLocation
from instagramy.plugins.download import *

filename = sys.argv[1]
count = sys.argv[2]

def get_links(filename, count):
    
    location = InstagramLocation('212988663', 'new-york-new-york')

    i=0
    my_file = open(filename+".txt", "w+")
    for post in location.top_posts:
        i+=1
        try:
            my_file.write(post.display_url+"\n")
            
            if i>count:
                break
        except:
            pass
    my_file.close()

get_links(filename, count)
