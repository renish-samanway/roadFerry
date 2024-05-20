import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, TextInput, StyleSheet, Dimensions, Alert, Keyboard } from 'react-native';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Colors from '../../helper/extensions/Colors';
import {OrderDetailsOptions} from '../../helper/extensions/dummyData';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import * as getDriverDataAction from '../../store/actions/transporter/driver/getDriverData';
import * as getVehicleDataAction from '../../store/actions/transporter/vehicle/getVehicleData';
import Loader from './Loader';
import AppConstants from '../../helper/constants/AppConstants';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";
import NotificationCall from '../../helper/NotificationCall';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class BottomSheetView extends Component {
    state = {
        selectedDriverData: {},
        selectedVehicleData: {},
        flagDriver: true,
        flagVehicle: false,
        search: '',
        driverList: [],
        vehicleList: [],
        isLoading: false,
        searchList: [],
        parcelID: ''
    };

    constructor(props) {
        super(props);
    }

    showLoading = () => {
        this.setState({ isLoading: true })
    }

    hideLoading = () => {
        this.setState({ isLoading: false })
    }
    /* componentWillReceiveProps(nextProps) {
        if (nextProps.driverList != undefined && this.props.driverList != undefined) {
            console.log('componentWillReceiveProps.driverList:', nextProps.driverList)
            // if (JSON.stringify(this.props.driverList) !== JSON.stringify(nextProps.driverList)) {
                this.getDriverVerifiedAndIsNotAssign()
            // }
        }

        if (nextProps.vehicleList != undefined && this.props.vehicleList != undefined) {
            console.log('componentWillReceiveProps.vehicleList:', nextProps.vehicleList)
            // if (JSON.stringify(this.props.vehicleList) !== JSON.stringify(nextProps.vehicleList)) {
                this.getVehicleVerifiedAndIsNotAssign()
            // }
        }
    } */

    /* getDriverVerifiedAndIsNotAssign = () => {
        let tDriverList = []
        for (let i = 0; i < this.props.driverList.length; i++) {
            let driverData = this.props.driverList[i];
            if (driverData.data.is_verified == AppConstants.driverStatusVerifiedKey && !driverData.data.is_assign) {
                tDriverList.push(driverData)
            }
        }
        console.log(`tDriverList.length: ${tDriverList.length}`)
        this.setState({ driverList: tDriverList })
    } */

    /* getVehicleVerifiedAndIsNotAssign = () => {
        let tVehicleList = []
        for (let i = 0; i < this.props.vehicleList.length; i++) {
            let vehicleData = this.props.vehicleList[i];
            if (vehicleData.data.is_verified == AppConstants.vehicleStatusVerifiedKey && !vehicleData.data.is_assign) {
                tVehicleList.push(vehicleData)
            }
        }
        console.log(`tVehicleList.length: ${tVehicleList.length}`)
        this.setState({ vehicleList: tVehicleList })
    } */

    componentDidMount() {
        // console.log(`componentDidMount.this.props.driverList:`, this.props.driverList);
        // console.log(`this.props.userUID:`, this.props.userUID);
        /* if (this.props.driverList == undefined || this.props.driverList.length == 0) {
            this.props.fetchDriverList(this.props.userUID, true)
        } else {
            this.props.fetchDriverList(this.props.userUID, false)
        }
        this.getDriverVerifiedAndIsNotAssign()

        if (this.props.vehicleList == undefined || this.props.vehicleList.length == 0) {
            this.props.fetchVehicleList(this.props.userUID, true)
        } else {
            this.props.fetchVehicleList(this.props.userUID, false)
        }
        this.getVehicleVerifiedAndIsNotAssign() */

        // this.setState({ driverList: driverList })
        console.log(`parcelData:`, this.props.parcelData)
        this.setState({ parcelID: this.props.parcelData.id })
        this.fetchDriverVerifiedAndIsNotAssignList()
    }

    fetchDriverVerifiedAndIsNotAssignList = () => {
        this.showLoading()
        const driverList = [];
        firestore()
        .collection('users')
        .doc(this.props.userUID)
        .collection('driver_details')
        .where('is_verified', '==', 'verified')
        .where('is_assign', '==', false)
        .where('is_deleted', '==', false)
        .get()
        .then((querySnapshot) => {
            console.log('Total driver_details (user_type && is_assign) data: ', querySnapshot.size);
            querySnapshot.forEach((documentSnapshot) => {
                // console.log('documentSnapshot.id: ', documentSnapshot.id);
                let isAddDriver = true
                // console.log(`this.props.parcelData:`, this.props.parcelData)
                if (this.props.parcelData.data.reject_details != undefined) {
                    let rejectDetailsList = this.props.parcelData.data.reject_details
                    for (let i = 0; i < rejectDetailsList.length; i++) {
                        let rejectDetailsData = rejectDetailsList[i];
                        console.log('rejectDetailsData.rejected_by: ', rejectDetailsData.rejected_by);
                        console.log('documentSnapshot.user_uid: ', documentSnapshot.get('user_uid'));
                        if (rejectDetailsData.rejected_by == documentSnapshot.get('user_uid')) {
                            isAddDriver = false
                            break
                        }
                    }
                } else {
                    isAddDriver = true
                }

                if (isAddDriver) {
                    driverList.push({id: documentSnapshot.id, data: documentSnapshot.data()});
                }
            });
            /* dispatch({
            type: IS_LOADING,
            isLoading: false,
            }); */
            this.setState({ driverList: driverList }, () => {
                if (driverList.length == 1) {
                    this.setState({ selectedDriverData:  driverList[0], flagDriver: false, flagVehicle: true })
                }
            });
            this.fetchVehicleVerifiedAndIsNotAssignList()
        }).catch(error => {
            console.log(`fetchDriverVerifiedAndIsNotAssignList.error:`,error)
            this.hideLoading()
        });
    }

    fetchVehicleVerifiedAndIsNotAssignList = () => {
        // console.log(`this.props.parcelData.data.vehicle_type:`, this.props.parcelData.data.vehicle_type)
        const vehicleList = [];
        firestore()
        .collection('users')
        .doc(this.props.userUID)
        .collection('vehicle_details')
        .where('is_verified', '==', 'verified')
        .where('vehicle_type', '==', this.props.parcelData.data.vehicle_type)
        .where('is_assign', '==', false)
        .where('is_deleted', '==', false)
        .get()
        .then((querySnapshot) => {
            // console.log('Total vehicle_details (user_type && is_assign) data: ', querySnapshot.size);
            querySnapshot.forEach((documentSnapshot) => {
                // console.log('documentSnapshot.id: ', documentSnapshot.id);
                vehicleList.push({id: documentSnapshot.id, data: documentSnapshot.data()});
            });
            
            /* dispatch({
                type: IS_LOADING,
                isLoading: false,
            }); */
            this.setState({ vehicleList: vehicleList, selectedVehicleData: vehicleList.length == 1 ? vehicleList[0] : [] })
            this.hideLoading()
        }).catch(error => {
            console.log(`fetchVehicleVerifiedAndIsNotAssignList.error:`,error)
            this.hideLoading()
        });
    }

    onBack = () => {
        this.props.navigation.goBack()
    }

    closeIconView = () => {
        return (
            <Icon 
                name="close"
                size={24}
                color={'white'}
            />
        )
    }

    selectDriverTextView = () => {
        return (
            <Text style={this.state.flagDriver ? styles.selectText : styles.unSelectText}>
                Select Driver
            </Text>
        )
    }

    selectVehicleTextView = () => {
        return (
            <Text style={this.state.flagVehicle ? styles.selectText : styles.unSelectText}>
                Select Vehicle
            </Text>
        )
    }

    driverItemView = (item) => {
        return (
            <View style={{...styles.itemRow, marginTop: 0}}>
                <Image
                    style={styles.itemImage}
                    // source={{uri: `data:${item.data.driver_photo.type};base64,${item.data.driver_photo.base64.toBase64()}`}}
                    source={{uri: typeof(item.data.driver_photo) === 'string' ? item.data.driver_photo : `data:${item.data.driver_photo.type};base64,${item.data.driver_photo.base64}`}}
                />
                {this.state.selectedDriverData.id == item.id ? (
                <Image
                    style={[styles.itemImage, {position: 'absolute'}]}
                    source={require('../../assets/assets/Transpoter/Dashboard/selected_tick.png')}
                />
                ) : (
                null
                )}
                <View>
                    <Text
                    style={
                        this.state.selectedDriverData.id == item.id
                        ? styles.selectTitleText
                        : styles.unSelectTitleText
                    }>
                    {this.props.userUID == item.data.user_uid ? 'Self' : `${item.data.first_name} ${item.data.last_name}`}
                    </Text>
                    <Text
                    style={
                        this.state.selectedDriverData.id == item.id
                        ? styles.selectTitleText
                        : styles.unSelectTitleText
                    }>
                    {`${item.data.phone_number}`}
                    </Text>
                </View>
            </View>
        )
    }

    vehicleItemView = (item) => {
        return (
            <View style={{...styles.itemRow, marginTop: 0}}>
                <Image
                    style={styles.itemImage}
                    source={require('../../assets/assets/dashboard/heavy_truck.png')}
                />
                {this.state.selectedVehicleData.id == item.id ? (
                <Image
                    style={[styles.itemImage, {position: 'absolute'}]}
                    source={require('../../assets/assets/Transpoter/Dashboard/selected_tick.png')}
                />
                ) : (
                null
                )}
                <View>
                    <Text
                    style={
                        this.state.selectedVehicleData.id == item.id
                        ? styles.selectTitleText
                        : styles.unSelectTitleText
                    }>
                    {item.data.vehicle_type}
                    </Text>
                    <Text
                    style={
                        this.state.selectedVehicleData.id == item.id
                        ? styles.selectTitleText
                        : styles.unSelectTitleText
                    }>
                    {item.data.vehicle_number}
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        // console.log(`render.this.props.driverList:`, this.props.driverList);
        return (
            <>
                <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
                    componentType="FlatList"
                    snapPoints={[50, '50%', windowHeight - 600]}
                    initialSnapIndex={1}
                    renderHandle={() => (
                    <View style={{}}>
                        <View style={styles.header}>
                            <View style={{justifyContent:'center', alignItems: 'center', flex: 1}}>
                                <View style={styles.panelHandle} />
                                <Text style={{...styles.titleText, marginTop: 8}}>
                                    Assign the driver & Vehicle
                                </Text>
                            </View>
                            <View style={{position: 'absolute', right: 12, alignSelf: 'center'}}>
                                {AppConstants.isAndroid ? 
                                <RNGHTouchableOpacity 
                                    style={styles.closeIcon}
                                    onPress={() => {
                                        this.props.onPressClose()
                                    }}>
                                    {this.closeIconView()}
                                </RNGHTouchableOpacity> :
                                <TouchableOpacity 
                                    style={styles.closeIcon}
                                    onPress={() => {
                                        this.props.onPressClose()
                                    }}>
                                    {this.closeIconView()}
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View style={styles.selectView}>
                            {AppConstants.isAndroid ?
                            <RNGHTouchableOpacity onPress={() => this.onPressSelectDriver_Vehicle('driver')}>
                                {this.selectDriverTextView()}
                            </RNGHTouchableOpacity> : 
                            <TouchableOpacity onPress={() => this.onPressSelectDriver_Vehicle('driver')}>
                                {this.selectDriverTextView()}
                            </TouchableOpacity>
                            }
                            <Text
                            style={{
                                ...styles.subTitleText,
                                marginLeft: 16,
                                marginRight: 16,
                            }}>
                            &gt;
                            </Text>
                            {AppConstants.isAndroid ?
                            <RNGHTouchableOpacity onPress={() => this.onPressSelectDriver_Vehicle('vehicle')}>
                                {this.selectVehicleTextView()}
                            </RNGHTouchableOpacity> :
                            <TouchableOpacity onPress={() => this.onPressSelectDriver_Vehicle('vehicle')}>
                                {this.selectVehicleTextView()}
                            </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.trackingView}>
                            <View style={styles.viewInputText}>
                            <Image
                                style={styles.trackingImage}
                                source={
                                    this.state.flagDriver
                                    ? require('../../assets/assets/Transpoter/Dashboard/add_driver.png')
                                    : require('../../assets/assets/Transpoter/Dashboard/add_vehicle.png')
                                }
                            />
                            <TextInput
                                style={styles.weightInputText}
                                placeholder={
                                    this.state.flagDriver ? 'Search Driver' : 'Search Vehicle'
                                }
                                returnKeyType="done"
                                value={this.state.search}
                                onChangeText={this.handleSearch}
                                /* error={!!search.error}
                                errorText={search.error} */
                                autoCapitalize="none"
                                autoCompleteType="name"
                                textContentType="name"
                                keyboardType="default"
                                ref={(ref) => {
                                    this._searchinput = ref;
                                }}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                            <View style={styles.searchView}>
                                <Image
                                style={{...styles.trackingImage, marginLeft: 0}}
                                source={require('../../assets/assets/dashboard/search.png')}
                                />
                            </View>
                            </View>
                        </View>
                        <Text
                            style={{
                            ...styles.titleText,
                            marginLeft: 16,
                            backgroundColor: Colors.backgroundColor,
                            }}>
                            {this.state.flagDriver
                            ? `${this.state.driverList != undefined ? this.state.driverList.length : 0} Drivers are available`
                            : `${this.state.vehicleList != undefined ? this.state.vehicleList.length : 0} Vehicles are available`}
                        </Text>
                    </View>
                    )}
                    data={this.state.search != '' ? this.state.searchList : this.state.flagDriver ? this.state.driverList : this.state.vehicleList}
                    keyExtractor={(i) => i}
                    renderItem={({item}) => {
                        // console.log(`item: `, item)
                        return (
                            <View style={{ }}>
                            {this.state.flagDriver && (
                                AppConstants.isAndroid ?
                                <RNGHTouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => {
                                        this.setState({ selectedDriverData: item })
                                    }}
                                >
                                    {this.driverItemView(item)}
                                </RNGHTouchableOpacity> :
                                <TouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => {
                                        this.setState({ selectedDriverData: item })
                                    }}
                                >
                                    {this.driverItemView(item)}
                                </TouchableOpacity>
                            )}
                            {this.state.flagVehicle && (
                                AppConstants.isAndroid ?
                                <RNGHTouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => {
                                        this.setState({ selectedVehicleData: item })
                                    }}
                                >
                                    {this.vehicleItemView(item)}
                                </RNGHTouchableOpacity> :
                                <TouchableOpacity
                                    style={styles.itemRow}
                                    onPress={() => {
                                        this.setState({ selectedVehicleData: item })
                                    }}
                                >
                                    {this.vehicleItemView(item)}
                                </TouchableOpacity>
                            )}
                            </View>
                        )
                    }}
                    contentContainerStyle={styles.contentContainerStyle}
                />
                {this.state.flagDriver && (
                    <View style={{...styles.actionButtonRow, justifyContent: 'center'}}>
                    <TouchableOpacity
                        style={{
                        ...styles.cancelView,
                        backgroundColor: Colors.primaryColor,
                        }}
                        onPress={() => this.onPressDriverNext()}>
                        <Text style={styles.cancelText}>Next</Text>
                    </TouchableOpacity>
                    </View>
                )}

                {this.state.flagVehicle && (
                    <View style={{...styles.actionButtonRow, justifyContent: 'center'}}>
                    <TouchableOpacity
                        style={{
                        ...styles.cancelView,
                        backgroundColor: Colors.acceptedViewColor,
                        }}
                        onPress={() => this.onPressVehicleAssign()}>
                        <Text style={styles.cancelText}>Accept Order</Text>
                    </TouchableOpacity>
                    </View>
                )}
                <Loader loading={this.state.isLoading} />
            </>
        );
    }

    handleSearch = text => {
        const formattedQuery = text.toLowerCase()
        let searchList = []
        if (this.state.flagDriver) {
            searchList = this.state.driverList.filter(driverData => {
                return this.contains(driverData.data, formattedQuery)
            })
        } else {
            searchList = this.state.vehicleList.filter(vehicleData => {
                return this.contains(vehicleData.data, formattedQuery)
            })
        }
        this.setState({ searchList: searchList, search: text }, () => {
            console.log(`this.state.searchList:`, this.state.searchList)
        })
    }

    contains = (data, query) => {
        if (this.state.flagDriver) {
            let searchFromText = `${data.first_name.toLowerCase()} ${data.last_name.toLowerCase()}`
            if (searchFromText.includes(query)) {
                return true
            }
        } else {
            if (data.vehicle_type.toLowerCase().includes(query) || data.vehicle_number.toLowerCase().includes(query)) {
                return true
            }
        }
        return false
    }

    // On press select driver and vehicle event
    onPressSelectDriver_Vehicle = (valueType) => {
        if (valueType === 'driver') {
            this.setState({ flagDriver: true, flagVehicle: false })
        } else {
            this.setState({ flagDriver: false, flagVehicle: true })
        }
    };

    onPressDriverNext = () => {
        if (Object.keys(this.state.selectedDriverData).length !== 0) {
            this.setState({ flagDriver: false, flagVehicle: true }, () => {
                
            })
        } else {
            Alert.alert(
                'Alert',
                'Please select the driver',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
            );
        }
    };
    
    onPressVehicleAssign = () => {
        if (Object.keys(this.state.selectedDriverData).length !== 0 && Object.keys(this.state.selectedVehicleData).length !== 0) {
            console.log(`setPopup(true)`)
            // setPopup(true);
            // this.props.onPressAcceptOrder()
            this.updateOrderDetails()
        } else {
            let message = ''
            if (Object.keys(this.state.selectedDriverData).length == 0 && Object.keys(this.state.selectedVehicleData).length == 0) {
                message = 'Please select the driver and vehicle'
            } else if (Object.keys(this.state.selectedDriverData).length == 0) {
                message = 'Please select the driver'
            } else {
                message = 'Please select the vehicle'
            }
            Alert.alert(
                'Alert',
                message,
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
            );
        }
    };

    updateOrderDetails = () => {
        // console.log(`parcelID: ${this.state.parcelID}`)
        this.state.selectedDriverData.data.is_assign = true
        this.state.selectedVehicleData.data.is_assign = true
        let driver_details = {...this.state.selectedDriverData.data, driver_id: this.state.selectedDriverData.id}
        let vehicle_details = {...this.state.selectedVehicleData.data, vehicle_id: this.state.selectedVehicleData.id}
        // console.log(`this.state.selectedDriverData: ${this.state.selectedDriverData.data.is_assign}`)

        // return
        this.showLoading()
        firestore()
        .collection('order_details')
        .doc(this.state.parcelID)
        .update({status: 'assigned', driver_details: driver_details, vehicle_details: vehicle_details})
        .then(()=> {
            console.log(`order_details.updated`)
            /* this.hideLoading()
            this.props.onPressAcceptOrder() */

            let acceptParams = {
                "userId": this.props.parcelData.data.requested_uid,
                "orderId": this.state.parcelID,
                "type": "accept"
            }
            NotificationCall(acceptParams)

            let assignParams = {
                "userId": this.props.parcelData.data.requested_uid,
                "orderId": this.state.parcelID,
                "type": "assign"
            }
            NotificationCall(assignParams)

            let assignDriverParams = {
                "userId": driver_details.user_uid,
                "orderId": this.state.parcelID,
                "type": "assign_driver"
            }
            NotificationCall(assignDriverParams)

            // return
            this.updateDriverDetails()
        }).catch(error => {
            console.log(`order_details.error:`, error)
            this.hideLoading()
        })
    }

    updateDriverDetails = () => {
        firestore()
        .collection('users')
        .doc(this.state.selectedDriverData.data.user_uid)
        .update({is_assign: true})
        .then(() => {
            console.log(`users.updated`)
            firestore()
            .collection('users')
            .doc(this.props.userUID)
            .collection('driver_details')
            .doc(this.state.selectedDriverData.id)
            .update({is_assign: true})
            .then(() => {
                console.log(`driver_details.updated`)
                this.updateVehicleDetails()
            })
            .catch(error => {
                console.log(`users.driver_details.error:`,error)
                this.hideLoading()
            })
        })
        .catch(error => {
            console.log(`users.error:`,error)
            this.hideLoading()
        })
    }

    updateVehicleDetails = () => {
        firestore().collection('vehicle_details').doc(this.state.selectedVehicleData.id).update({is_assign: true})
        firestore()
        .collection('users')
        .doc(this.props.userUID)
        .collection('vehicle_details')
        .doc(this.state.selectedVehicleData.id)
        .update({is_assign: true})
        .then(() => {
            console.log(`vehicle_details.updated`)
            this.updateIsRequest()
        }).catch(error => {
            console.log(`vehicle_details.update.error:`,error)
            this.hideLoading()
        });
    }

    updateIsRequest = () => {
        firestore()
        .collection('users')
        .doc(this.props.userUID)
        .collection('driver_details')
        .where('is_verified', '==', 'verified')
        .where('is_assign', '==', false)
        .where('is_deleted', '==', false)
        .get()
        .then((querySnapshot) => {
            console.log('Total driver_details (is_verified, is_assign, is_deleted) data: ', querySnapshot.size);
            let availableDriverCount = querySnapshot.size
            firestore()
            .collection('users')
            .doc(this.props.userUID)
            .collection('vehicle_details')
            .where('is_verified', '==', 'verified')
            .where('is_assign', '==', false)
            .where('is_deleted', '==', false)
            .get()
            .then((querySnapshot) => {
                console.log('Total vehicle_details (is_verified, is_assign, is_deleted) data: ', querySnapshot.size);
                let availableVehicleCount = querySnapshot.size
                let isRequest = true
                if (availableDriverCount >= 1 && availableVehicleCount >= 1) {
                    console.log(`is_request=true`)
                    isRequest = true
                } else {
                    console.log(`is_request=false`)
                    isRequest = false
                }
                // console.log(`this.props.userUID:`, this.props.userUID)

                this.props.onPressAcceptOrder()
                this.hideLoading()
                
                firestore()
                .collection('users')
                .doc(this.props.userUID)
                .update({ is_request: isRequest })
            })
            .catch(error => {
                console.log(`vehicle_details.error:`, error)
            })
        })
        .catch(error => {
            console.log(`vehicle_details.error:`, error)
        })
    }
}

const styles = StyleSheet.create({
    titleText: {
      color: Colors.titleTextColor,
      fontSize: RFPercentage(2),
      fontFamily: 'SofiaPro-SemiBold',
    },
    subTitleText: {
      fontFamily: 'SofiaPro-SemiBold',
      fontSize: RFPercentage(2),
      color: Colors.subTitleTextColor,
    },
    contentContainerStyle: {
      flex: 1,
      padding: 16,
      // marginLeft: 55,
      backgroundColor: Colors.backgroundColor,
    },
    header: {
      alignItems: 'center',
      backgroundColor: Colors.backgroundColor,
      paddingVertical: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      shadowOffset: {width: 5, height: 0},
      shadowRadius: 5,
      shadowOpacity: 0.25,
      elevation: 5,
      borderBottomWidth: 0,
      flexDirection: 'row',
    },
    panelHandle: {
      width: 35,
      height: 3,
      backgroundColor: Colors.subViewBGColor,
      borderRadius: 4,
    },
    selectView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.backgroundColor,
      height: 44
    },
    selectText: {
      // margin: 16,
      fontFamily: 'SofiaPro-Regular',
      fontSize: RFPercentage(2),
      color: Colors.primaryColor,
    },
    unSelectText: {
      // margin: 16,
      fontFamily: 'SofiaPro-Regular',
      fontSize: RFPercentage(2),
      color: Colors.titleTextColor,
    },
    trackingView: {
      width: '100%',
      marginTop: -8,
      backgroundColor: Colors.backgroundColor,
    },
    viewInputText: {
      margin: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.subViewBGColor,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: Colors.subViewBGColor,
    },
    weightInputText: {
      paddingLeft: 12,
      paddingRight: 16,
      fontSize: RFPercentage(1.8),
      // fontFamily: 'SofiaPro-Medium',
      color: Colors.titleTextColor,
      // backgroundColor: Colors.backgroundColor,
      height: 50,
      width: Dimensions.get('window').width - 124,
      borderRadius: 10,
    },
    trackingImage: {
      marginLeft: 16,
      height: 25,
      width: 25,
    },
    searchView: {
      marginRight: 16,
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    itemRow: {
      flexGrow: 1,
      marginTop: 16,
      flexDirection: 'row',
      backgroundColor: Colors.backgroundColor,
      alignItems: 'center',
    },
    itemImage: {
      height: 30,
      width: 30,
      borderRadius: 15,
    },
    selectTitleText: {
      marginLeft: 16,
      color: Colors.primaryColor,
      fontSize: RFPercentage(2),
      fontFamily: 'SofiaPro-SemiBold',
    },
    unSelectTitleText: {
      marginLeft: 16,
      color: Colors.titleTextColor,
      fontSize: RFPercentage(2),
      fontFamily: 'SofiaPro-SemiBold',
    },
    actionButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.backgroundColor,
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 5,
        shadowOpacity: 0.15,
        elevation: 5
    },
    cancelView: {
        margin: 16,
        width: windowWidth / 2 - 32,
        height: 50,
        borderRadius: 25,
        // borderColor: Colors.primaryColor,
        // borderWidth: 0.5,
        backgroundColor: Colors.rejectedColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: RFPercentage(2.2),
        fontFamily: 'SofiaPro-Regular',
        color: Colors.backgroundColor,
    },
    closeIcon: {
        borderRadius: 32, 
        padding: 2, 
        backgroundColor: 'black', 
        alignSelf: 'center', 
        borderWidth: 2
    }
});

const mapStateToProps = state => ({
    driverList: state.transporterDriverData.driverData,
    vehicleList: state.transporterVehicleData.vehicleData,
    isLoading: state.transporterDriverData.isLoading
});

const mapDispatchToProps = dispatch => {
    return {
        fetchDriverList: (userID, isStartProgress) => dispatch(getDriverDataAction.fetchDriverList(userID, isStartProgress)),
        fetchVehicleList: (userID, isStartProgress) => dispatch(getVehicleDataAction.fetchVehicleList(userID, isStartProgress))
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(BottomSheetView);
