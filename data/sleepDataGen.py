import random 
f = open('tempData.txt', 'w')

data_pts = 30

date = 20141201

#wake_up_rng = [4, 11]
#time_in_bed_rng = [9, 12]
#fell_asleep_rng = [9, 12]
f.write("TimeOfDay,WakeUpTime,TimeInBed,FellAsleep\n")

for i in range(data_pts):
  wake_up = int(max(min(11, random.gauss(7,1.5)), 4))#random.uniform(wake_up_rng[0], wake_up_rng[1])
  
  time_in_bed = int(max(min(24, random.gauss(22.5, 1.5)), 21))
  
  fell_asleep = int(min(time_in_bed, max(min(24, random.gauss(22.5, 2)),  21)))
  
  row_data = [ date, wake_up, time_in_bed, fell_asleep ]
  f.write(",".join([str(i) for i in row_data])+"\n")
  date += 1

f.close()



