PIPES  = {
    0: "─",
    1: "│",
    2: "┌",
    3: "┐",
    4: "└",
    5: "┘",
}

#i was really tempted to take 3,5,6,9,10,12 instead of hardcoding stuff :(
UP    = [1,4,5]
DOWN  = [1,2,3]
LEFT  = [0,3,5]
RIGHT = [0,2,4]

width = 2
height = 3

def gen(m = width, n = height, so_far = (), components = ()):
    if len(so_far)+1 == m*n:
        return [so_far+(5,)]
    a = []
    for i in range(6):
        c = len(so_far)
        if i in UP:
            if c<m or so_far[-m] not in DOWN:continue
        else:
            if c>=m and so_far[-m] in DOWN:continue
        if i in DOWN:
            if c>=m*n-m:continue
        if i in LEFT:
            if c%m==0 or so_far[-1] not in RIGHT:continue
        else:
            if c%m!=0 and so_far[-1] in RIGHT:continue
        if i in RIGHT:
            if c%m==m-1:continue
        if i in UP and i in LEFT:
            x = components[-m]
            y = components[-1]
            if x == y: continue
            new_components = tuple(y if j==x else j for j in components[-m:]) + (y,)
        elif i in UP:
            new_components = components[-m:] + (components[-m],)
        elif i in LEFT:
            new_components = components[-m:] + (components[-1],)
        else:
            new_components = components[-m:] + (c,)
        current = so_far + (i,)
        a += gen(m,n,current,new_components)
    return a

def p(m,n,t):
    for i in range(n):
        print("".join(PIPES[t[x]] for x in range(i*m,min(len(t),(i+1)*m))))

