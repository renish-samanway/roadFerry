
export const calculatePrice = (distanceValue, selectedVehicleTypeData) => {
    console.log(`selectedVehicleTypeData:`, selectedVehicleTypeData)
    if (selectedVehicleTypeData == undefined) {
        return
    }
    console.log(`distance:`, distanceValue)
    console.log(`minimumRate:`, selectedVehicleTypeData.data.minimumRate)
    let minRate = 0
    if (selectedVehicleTypeData.data.minimumRate != undefined) {
        minRate = selectedVehicleTypeData.data.minimumRate
    }
    console.log(`selectedVehicleType:`, selectedVehicleTypeData.data.rates)
    let finalRate = parseFloat(minRate)
    console.log(`finalRate:`, finalRate)
    let differenceDistance = parseFloat(distanceValue)
    for (let i = 0; i < selectedVehicleTypeData.data.rates.length; i++) {
        let ratesData = selectedVehicleTypeData.data.rates[i];
        let start = parseFloat(ratesData.start)
        let end = parseFloat(ratesData.end)
        let rate = parseFloat(ratesData.rate)
        
        if (i == 0 && start == 0) {
            start = 1
        }
        if (distanceValue >= start) {
            start = start - 1
        }

        if ((end == -1 || distanceValue <= end || i == selectedVehicleTypeData.data.rates.length-1) && distanceValue >= start) {
            console.log(`differenceOfStart:`, distanceValue-start)
            finalRate = finalRate + ((distanceValue-start) * rate)
            break
        } else if (differenceDistance >= start) {
            differenceDistance = differenceDistance - end
            let differenceOfStartNEnd = end - start
            console.log(`differenceOfStartNEnd:`, differenceOfStartNEnd)
            finalRate = finalRate + (differenceOfStartNEnd * rate)
        }
        console.log(`finalRate:`, finalRate)
    }
    console.log(`finalRate:`, finalRate)
    return finalRate
}