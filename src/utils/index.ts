import * as moment from 'moment';

interface Time {
  hour: number;
  minutes: number;
}

export function divideTimeRange(
  startTime: Time,
  endTime: Time,
  timeSlotLength: number
): Time[] {
  const timeSlots: Time[] = [];
  let currentHour = startTime.hour;
  let currentMinute = startTime.minutes;

  while (
    currentHour < endTime.hour ||
    (currentHour === endTime.hour && currentMinute < endTime.minutes)
  ) {
    timeSlots.push({ hour: currentHour, minutes: currentMinute });

    currentMinute += timeSlotLength;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  // Add the end time if it wasn't added in the loop
  if (
    timeSlots.length === 0 ||
    timeSlots[timeSlots.length - 1].hour !== endTime.hour ||
    timeSlots[timeSlots.length - 1].minutes !== endTime.minutes
  ) {
    timeSlots.push(endTime);
  }

  return timeSlots;
}
export function getDateRange(startDate, endDate) {
  const dateArray = [];
  const format = 'YYYY-MM-DD HH:mm:ss';
  let currentDate = moment(startDate, format);
  console.log(currentDate)
  console.log(moment(endDate, format))
  while (currentDate.valueOf() <= moment(endDate, format).valueOf()) {
    console.log(currentDate.valueOf() <= moment(endDate, format).valueOf())
    dateArray.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "days");
  }
  return dateArray;
}
