from datetime import datetime
import sys
import random
import string

filename = sys.argv[1]
count = sys.argv[2]

def get_links(my_file, count):
	location = InstagramLocation('212988663', 'new-york-new-york')
	i=0
	for post in location.top_posts:
		i+=1
		try:
			my_file.write(post.display_url+"\n")
			if i>count:
				break
		except:
			pass

filename += ".txt"

my_file = open(filename, "w+")
get_links(my_file, count)
my_file.close()
