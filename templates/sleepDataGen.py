import random 
f = open('sleepData.tsv', 'a')

data_pts = 30

date = 20121201

#wake_up_rng = [4, 11]
#time_in_bed_rng = [9, 12]
#fell_asleep_rng = [9, 12]

for i in range(data_pts):
  wake_up = max(min(11, random.gauss(7,1.5)), 4)#random.uniform(wake_up_rng[0], wake_up_rng[1])
  
  time_in_bed = max(min(24, random.gauss(22.5, 1)), 21)
  
  fell_asleep = min(time_in_bed, max(min(24, random.gauss(22.5, 1)),  21))
  date += 1
  row_data = [ date, wake_up, time_in_bed, fell_asleep ]
  f.write("\t".join([str(i) for i in row_data])+"\n")





