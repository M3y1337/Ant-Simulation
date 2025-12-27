Add a 'visited' flag in imagemap + dont show all cells mode in order to display regular cells once they have been visited by ants
Or display them differently in do show all mode

Pixel mode rendering experiments:
pixelated ant triangle, 
ant asci, 
ant subpixel randomized noise based on number, 
pherormone pixel circles + radius, various others similar to those for ant
repixilate with filter, 
use subpixel/smallerpixel grid to grow and/or stack food dots around nest in this mode when collecting them

various other general rendering experiments such as circular pixels, fading various functionality colors over time, overall ascii mode, mixed modes
experiment with blending modes, transparencies, permanently drawing trails, etc
display but apply filter such as dithering or black and white to other grid cells from imagemap
concave hull around ant positions
use ants / similar things (such as slimemold) as sequencer input (see other project) based on simply having the grid there probe for cells with most amount of certain color 

sim functionality ideas:
multi food source and obstacle array, either simulatneously (evenly or weighted), or as a sequential thing
food respawn/random redistribution throughout same or new colors/areas
energy level / burrowing, different types of soil/obstacle
multi nest (same colony or not, underground tunnels/entering and leaving different nests within same colony)
food depleted pherormone trail
life timer, death, colony growth based on food, various real-life based aspects

ant trait evolution / meta-optimization sim based on genetic algorithm (either generational with fitness function for time till cleared/num food gathered, or some sort of 'dna' based realtime one with ant reproduction)
