import React, { Component } from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, Dimensions, Linking } from 'react-native';
import Colors from '../../helper/extensions/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { connect } from 'react-redux';
import AppConstants from '../../helper/constants/AppConstants';
import firestore from '@react-native-firebase/firestore';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import NotificationCall from '../../helper/NotificationCall';
import auth from '@react-native-firebase/auth';


const windowWidth = Dimensions.get('window').width;

class MenuView extends Component {
    state = {
        optionsList: [],
        isMenuVisible: true
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let isAssigned = this.props.isAssigned
        console.log(`this.props.data:`, this.props.data, this.props.data?.data?.status)
        if (this.props.data?.data?.status == 'dispute') {
            this.setState({ isMenuVisible: false })
        }
        if (isAssigned) {
            this.setState({ optionsList: ['Started', 'Reject'] })
        } else {
            this.setOptionsList()
        }
    }

    setOptionsList = () => {
        if (this.props.data.data.status == 'on-way') {
            this.setState({ optionsList: ['Unloading', 'Dispute', 'Unloaded'] })
        } else if (this.props.data.data.status == 'unloading') {
            this.setState({ optionsList: ['Dispute', 'Unloaded'] })
        } else if (this.props.data.data.status == 'dispute') {
            this.setState({ optionsList: ['Unloaded'] })
        } else {
            this.setState({ optionsList: ['On-Way', 'Unloading', 'Dispute', 'Unloaded'] })
        }
    }

    onBack = () => {
        this.props.navigation.goBack()
    }

    onCompleteOrder = (orderData) => {
        console.log('menu item is pressed', orderData)
        const { user, userUID } = this.props
        const { user_type } = user
        if (user_type == 'driver') {
            firestore()
                .collection('users')
                .doc(orderData.data.transporter_uid)
                .collection('driver_details')
                .doc(orderData.data.driver_details.driver_id)
                .update({ is_assign: false }).then(() => {
                    firestore()
                        .collection('users')
                        .doc(orderData.data.transporter_uid)
                        .update({ is_assign: false, is_request: true }).then(() => {
                            firestore().collection('vehicle_details').doc(orderData.data.vehicle_details.vehicle_id).update({ is_assign: false })
                            firestore()
                                .collection('users')
                                .doc(userUID)
                                .update({ is_assign: false }).then(() => {
                                    firestore()
                                        .collection('users')
                                        .doc(orderData.data.transporter_uid)
                                        .collection('vehicle_details')
                                        .doc(orderData.data.vehicle_details.vehicle_id)
                                        .update({ is_assign: false })
                                }).catch((e) => console.log('while updating vehicle exception is generated', e))
                        }).catch((e) => console.log('while updating firebase driver exception is generated', e))
                }).catch((e) => console.log('exception is generated', e))
        }
        else {
            if (user_type == 'transporter' && orderData.data.driver_details.user_uid == userUID) {
                firestore()
                    .collection('users')
                    .doc(userUID)
                    .update({ is_assign: false, is_request: true })
                    .then(() => {
                        console.log('transporter is updated')
                        firestore()
                            .collection('users')
                            .doc(userUID)
                            .collection('driver_details')
                            .doc(orderData.data.driver_details.driver_id)
                            .update({ is_assign: false })
                            .then(() => {
                                console.log('driver of this transporter is updated')
                                firestore().collection('vehicle_details').doc(orderData.data.vehicle_details.vehicle_id).update({ is_assign: false })
                                firestore()
                                    .collection('users')
                                    .doc(userUID)
                                    .collection('vehicle_details')
                                    .doc(orderData.data.vehicle_details.vehicle_id)
                                    .update({ is_assign: false })
                            })
                            .catch((e) => console.log('exception is generated while updating driver details', e))
                    })
                    .catch((e) => console.log('exception is generated while updating transporter', e))
            }
            // user type transporter as driver
        }
    }

    openGoogleMaps = (orderData) => {
        const { data } = orderData
        const { drop_location } = data
        if (drop_location.coordinate.latitude != undefined && drop_location.coordinate.longitude != undefined) {
            let url = `https://www.google.com/maps/dir/?api=1&destination=${drop_location.coordinate.latitude},${drop_location.coordinate.longitude}`
            Linking.openURL(url)
        }
    }

    openOtpScreen = (orderData, status) => {
        this.signInWithPhoneNumber(orderData, status)
    }

    signInWithPhoneNumber = (orderData, status) => {
        if (orderData.data.created_by?.phone_number != undefined) {
            console.log('handle on created by', orderData.data.created_by?.phone_number)
            this.props.showLoader()
            this.handelAuth(orderData.data.created_by?.phone_number, orderData, status)
        }
        else {
            this.props.showLoader()
            console.log('order data', orderData)
            const { data, id } = orderData
            const { requested_uid } = data
            firestore()
                .collection('users')
                .doc(requested_uid)
                .get()
                .then((userData) => {
                    const customer = userData.data()
                    console.log('customer data', customer)
                    const { phone_number } = customer
                    if (phone_number) {
                        console.log(phone_number)
                        this.handelAuth(phone_number, orderData, status)
                    }
                    else {
                        console.log('exception is generated')
                        this.props.hideLoader()
                        //handle exception
                    }
                })
                .catch((e) => {
                    console.log('exception is generated', e)
                })
        }
    }

    handelAuth = (phoneNumber, orderData, status) => {
        console.log('phone number from auth', phoneNumber, orderData, status)
        let phoneNumberCustomer = `${AppConstants.country_code} ${phoneNumber}`
        auth()
            .signInWithPhoneNumber(phoneNumberCustomer, true)
            .then(confirmResult => {
                this.props.hideLoader()
                this.props.navigation.navigate({
                    routeName: 'verificationUserScreen',
                    params: {
                        phoneNumber: phoneNumber,
                        confirm: confirmResult,
                        orderData: orderData,
                        isUserVerification: true,
                        status: status
                    },
                });
            })
            .catch(error => {
                alert(error.message)
                this.props.hideLoader()
                console.log(error)
            });
    }

    render() {
        let index = 0
        return (
            <>
                {this.state.isMenuVisible &&
                    <Menu
                        ref={(ref) => (this.menu = ref)}
                        style={{ marginBottom: 64 }}
                        button={
                            <TouchableOpacity
                                style={styles.optionView}
                                disabled={this.props.data?.data?.status == 'dispute' ? true : false}
                                onPress={() => this.menu.show()}>
                                <Text style={styles.optionText}>{this.props.isAssigned ? `Not started` : `${this.props.data.data.status}`}</Text>
                                <Image
                                    style={styles.optionImage}
                                    source={require('../../assets/assets/Driver/Dashboard/ic_dropdown.png')}
                                />
                            </TouchableOpacity>
                        }
                    >
                        {this.loadOptionView()}
                    </Menu>}
            </>
        );
    }

    loadOptionView = () => {
        let menuItemList = []
        for (let i = 0; i < this.state.optionsList.length; i++) {
            let optionData = this.state.optionsList[i];
            menuItemList.push(
                <MenuItem
                    textStyle={styles.menuItemText}
                    style={styles.menuItemView}
                    disabled={this.props.data?.data?.status == 'dispute' ? true : false}
                    onPress={() => {
                        // this.onCompleteOrder(this.props.data)
                        // this.openGoogleMaps(this.props.data)
                        // this.openOtpScreen(this.props.data)
                        this.menu.hide()

                        console.log(`index:`, i)
                        if (this.props.isAssigned && i == 1) {
                            this.props.navigation.navigate({
                                routeName: 'CancelOrderScreen',
                                params: {
                                    orderData: this.props.data,
                                    refreshData: () => {
                                        this.props.onRefreshList()
                                    }
                                }
                            })
                            return
                        }
                        let updatedStatus = ''
                        if (this.props.isAssigned) {
                            updatedStatus = 'on-loading'
                            console.log('this.update state', updatedStatus)
                            this.openOtpScreen(this.props.data, updatedStatus)
                            return
                        } else if (optionData.toLowerCase() == 'unloaded') {
                            updatedStatus = 'completed'
                            this.openOtpScreen(this.props.data, updatedStatus)
                            return
                        } else {
                            updatedStatus = optionData.toLowerCase()
                        }

                        console.log(`updatedStatus:${updatedStatus}`)


                        // return
                        this.props.showLoader()
                        firestore()
                            .collection('order_details')
                            .doc(this.props.data.id)
                            .update({ status: updatedStatus })
                            .then(() => {
                                console.log(`order_details.updated`)

                                if (updatedStatus == 'completed') {
                                    // this.onCompleteOrder(this.props.data);
                                    let parameters = {
                                        "userId": this.props.data.data.requested_uid,
                                        "orderId": this.props.data.id,
                                        "type": "unloaded"
                                    }
                                    NotificationCall(parameters)
                                } else if (updatedStatus == 'on-loading') {
                                    let parameters = {
                                        "userId": this.props.data.data.requested_uid,
                                        "orderId": this.props.data.id,
                                        "type": "started"
                                    }
                                    NotificationCall(parameters)
                                }
                                if (updatedStatus == 'on-way') {
                                    let parameters = {
                                        "userId": this.props.data.data.requested_uid,
                                        "orderId": this.props.data.id,
                                        "type": "on-way"
                                    }
                                    NotificationCall(parameters)
                                }
                                if (updatedStatus == 'unloading') {
                                    let parameters = {
                                        "userId": this.props.data.data.requested_uid,
                                        "orderId": this.props.data.id,
                                        "type": "unloading"
                                    }
                                    NotificationCall(parameters)
                                }
                                if (updatedStatus == 'dispute') {
                                    this.setState({ isMenuVisible: false })
                                    let parameters = {
                                        "userId": this.props.data.data.requested_uid,
                                        "orderId": this.props.data.id,
                                        "type": "dispute"
                                    }
                                    NotificationCall(parameters)
                                }

                                this.props.data.data.status = updatedStatus
                                this.setOptionsList()
                                this.props.onRefreshList()

                                if (updatedStatus == 'on-way') {
                                    this.openGoogleMaps(this.props.data)
                                }
                            }).catch(error => {
                                console.log(`order_details.error:`, error)
                                this.props.hideLoader()
                            })
                        console.log(`this.props.data.id:`, this.props.data.id)
                    }}
                >
                    {optionData}
                </MenuItem>
            )
        }
        return menuItemList
    }
}

const styles = StyleSheet.create({
    menuItemText: {
        textAlign: 'center',
        fontSize: RFPercentage(2),
        fontFamily: 'SofiaPro-Regular'
    },
    menuItemView: {
        backgroundColor: Colors.mainBackgroundColor
    },
    optionView: {
        margin: 16,
        marginTop: 0,
        width: windowWidth / 2 - 64,
        height: 50,
        borderRadius: 25,
        borderColor: Colors.titleTextColor,
        borderWidth: 0.5,
        flexDirection: 'row',
        // backgroundColor: Colors.acceptedViewColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: RFPercentage(1.8),
        fontFamily: 'SofiaPro-Regular',
        color: Colors.titleTextColor,
    },
    optionImage: {
        height: 30,
        width: 30,
    },
});

const mapStateToProps = state => ({
    userUID: state.fetchProfileData.userUID,
    user: state.fetchProfileData.fetchProfileData
});

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(MenuView);