import random 
f = open('tempData.txt', 'w')

data_pts = 30

date = 20141201

#wake_up_rng = [4, 11]
#time_in_bed_rng = [9, 12]
#fell_asleep_rng = [9, 12]
f.write("TimeOfDay,WakeUpTime,TimeInBed,FellAsleep\n")
# round(x*4)/4
for i in range(data_pts):
  wake_up = round(max(min(11, random.gauss(7,1.5)), 4)*4)/4#random.uniform(wake_up_rng[0], wake_up_rng[1])
  
  time_in_bed = round(max(min(24, random.gauss(22.5, 1.5)), 21)*4)/4
  
  fell_asleep = round(min(time_in_bed, max(min(24, random.gauss(22.5, 2)),  21))*4)/4
  
  row_data = [ date, wake_up, time_in_bed, fell_asleep ]
  f.write(",".join([str(i) for i in row_data])+"\n")
  date += 1

f.close()



