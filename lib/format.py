s = ': [inv]'
with open('inv.yml', 'w') as out_file:
    with open('test.yml', 'r') as in_file:
        for line in in_file:
            out_file.write(line.rstrip('\n') + s + '\n')
