inputFile = open("day1/input.txt", "r")
lines = inputFile.readlines()
words = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
res_1 = 0
res_2 = 0
for line in lines:
    part_1_numbers = []
    part_2_numbers = []
    for [index, char] in enumerate(line):
        if char.isnumeric():
            part_1_numbers.append(int(char))
            part_2_numbers.append(int(char))
        else:
            for [number, word] in enumerate(words):
                splitTo = index + len(word)
                if line[index:splitTo] == word:
                    part_2_numbers.append(number + 1)

    res_1 += int(f"{part_1_numbers[0]}{part_1_numbers[-1]}")
    res_2 += int(f"{part_2_numbers[0]}{part_2_numbers[-1]}")

print("part 1:", res_1)
print("part 2:", res_2)
