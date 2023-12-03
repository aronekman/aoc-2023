inputFile = open("day2/input.txt", "r")
lines = inputFile.readlines()

part_1_result = 0
part_2_result = 0

cube_max_counts = {"red": 12, "green": 13, "blue": 14}
for line in lines:
    game_id = int(line.split(": ")[0].split(" ")[1])
    possible = True
    minimum_set = {"red": 0, "green": 0, "blue": 0}
    for set in line.split(": ")[1].split("; "):
        for cube in set.split(", "):
            [count, color] = cube.rstrip().split(" ")
            if int(count) > cube_max_counts[color]:
                possible = False
            if int(count) > minimum_set[color]:
                minimum_set[color] = int(count)
    if possible:
        part_1_result += game_id
    part_2_result += minimum_set["red"] * minimum_set["green"] * minimum_set["blue"]

print("Part 1:", part_1_result)
print("Part 2:", part_2_result)
