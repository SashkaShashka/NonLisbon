from datetime import datetime
import sys
import random
import string

filename = sys.argv[1]

def generate_random_string(length):
    letters = string.ascii_lowercase
    rand_string = ''.join(random.choice(letters) for i in range(length))
    return rand_string

filename += ".txt"

count_string = random.randrange(10, 50)
my_file = open(filename, "w+")
for i in range(count_string):
    count_letters = random.randrange(10, 50)
    my_file.write(generate_random_string(count_letters)+"\n")
my_file.close()
