inputFile = open("input.txt", "r")
lines = inputFile.readlines()
words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
res = 0
for line in lines:
    numbers = []
    for [index, char] in enumerate(line):
        if char.isnumeric():
            numbers.append(int(char))
        else:
            for [number, word] in enumerate(words):
                splitTo = index + len(word)
                if line[index:splitTo] == word:
                    numbers.append(number + 1)

    res += int(f"{numbers[0]}{numbers[-1]}")

print("part 2:", res)
