import React from 'react';
import {Image, View} from "react-native";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";

const CustomDrawer = (props) => {
    return (
        <DrawerContentScrollView
            scrollEnabled={true}
        >
            <View className="flex justify-center items-center mx-3, p-10 mb-10 h-[150px] bg-unirLogoBg rounded-md">
                <View className="flex-1 w-full h-fit items-center self-center absolute">
                    <Image
                        source={{uri: 'https://pbs.twimg.com/profile_images/1665712824541143042/RtnpwzJp_400x400.png'}}
                        style={{
                            width: 150,
                            height: 100,
                            backgroundColor: '#0096c3',
                        }}
                    />
                </View>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
export default CustomDrawer;