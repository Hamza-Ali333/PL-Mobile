import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  Animated,
  findNodeHandle,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AboutComponent from "../AboutComponent";
import DiscussionComponent from "../DiscussionComponent";
import ShareComponent from "../ShareComponent";

const data = [
  {
    key: 0,
    title: "About",
    child: AboutComponent,
    ref: React.createRef(),
  },
  {
    key: 1,
    title: "Discussion",
    child: DiscussionComponent,
    ref: React.createRef(),
  },
  {
    key: 2,
    title: "Share",
    child: ShareComponent,
    ref: React.createRef(),
  },
];

const { width } = Dimensions.get("screen");

const Tab = React.forwardRef(({ item, onItemPress, activeTab }, ref) => {
  return (
    <TouchableOpacity onPress={onItemPress}>
      <View ref={ref}>
        <Text
          style={{
            color: "#FF8635",
            fontSize: 50 / data.length,
            fontWeight: "600",
            textTransform: "uppercase",
          }}
        >
          {item.title}
        </Text>
        {item.key === activeTab && (
          <Animated.View
            style={{
              position: "absolute",
              height: 4,
              width: "100%",
              left: 0,
              backgroundColor: "#FF8635",
              bottom: -10,
              borderRadius: 50,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
});

const Tabs = ({ data, onItemPress, activeTab }) => {
  const containerRef = useRef();

  return (
    <View style={{ position: "absolute", top: 20, width }}>
      <View
        ref={containerRef}
        style={{
          justifyContent: "space-evenly",
          flex: 1,
          flexDirection: "row",
        }}
      >
        {data.map((item, index) => {
          return (
            <>
              <Tab
                key={item.key}
                item={item}
                ref={item.ref}
                activeTab={activeTab}
                onItemPress={() => onItemPress(index)}
              />
            </>
          );
        })}
      </View>
    </View>
  );
};

export default function App(props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const ref = useRef();
  const [tabHeight, setTHeight] = useState(props.tab1Height);

  const onItemPress = useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * width,
    });
  });

  useEffect(() => {
    setHeightOfTab(0);
  }, [props]);

  setHeightOfTab = (index) => {
    setTHeight(
      index == 0
        ? props.tab1Height
        : index == 1
        ? props.tab2Height
        : props.tab3Height
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Animated.FlatList
          style={{
            height: tabHeight,
            marginTop: 60,
            flexGrow: 0,
          }}
          data={data}
          ref={ref}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
              listener: (event) => {
                const slideSize = event.nativeEvent.layoutMeasurement.width;
                const index = event.nativeEvent.contentOffset.x / slideSize;
                const roundIndex = Math.round(index);
                setTHeight(
                  roundIndex == 0
                    ? props.tab1Height
                    : roundIndex == 1
                    ? props.tab2Height
                    : props.tab3Height
                );
                setIndex(roundIndex);
              },
            }
          )}
          bounces={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            return (
              <View style={{ width: width }}>
                <item.child {...props} />
              </View>
            );
          }}
        />
        <Tabs data={data} onItemPress={onItemPress} activeTab={index} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
