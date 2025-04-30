import React, { useEffect } from 'react';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Side } from '@/config/constants';
import { useVector, snapPoint } from 'react-native-redash';
import { HEIGHT, LEFT_SNAP_POINTS, MARGIN_WIDTH, MIN_LEDGE, NEXT, PREV, WIDTH } from '@/config/constants';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Platform, StyleSheet, View } from 'react-native';
import Wave  from './wave';

type SliderProps = {
  index: number;
  setIndex: (value: number) => void;
  prev?: JSX.Element | null;
  next?: JSX.Element;
  children: JSX.Element;
};


function Slider({
     index, 
     setIndex, 
     prev, 
     next, 
     children: current 
    }: SliderProps) {
    const hasPrev =!!prev;
    const hasNext = !!next;
    const zindex = useSharedValue(0);
    const activeSide = useSharedValue(Side.NONE);
    const isTransitioningLeft = useSharedValue(false);
    const isTransitioningRight = useSharedValue(false);
    const left = useVector(MIN_LEDGE, HEIGHT / 2);
    const right = useVector(MIN_LEDGE, HEIGHT / 2);

    const pandGesture =  Gesture.Pan().onStart(({x}) => {
        if(x < MARGIN_WIDTH && hasPrev) {
            activeSide.value = Side.LEFT;
            zindex.value = 100;
        }else if(x>=WIDTH-MARGIN_WIDTH && hasNext){
            activeSide.value = Side.RIGHT;
        }else {
            activeSide.value = Side.NONE;
            zindex.value = 0;
        }
}).onUpdate(({x,y}) => {
    if(activeSide.value === Side.LEFT) {
        left.x.value = Math.max(x, MARGIN_WIDTH);
        left.y.value = y;
    }else if(activeSide.value === Side.RIGHT) {
        right.x.value = Math.max(WIDTH - 1, MARGIN_WIDTH);
        right.y.value = y;
    }
}).onEnd(({x,velocityX, velocityY}) => {
    if(activeSide.value === Side.LEFT) {
        const dest = snapPoint(x, velocityX, LEFT_SNAP_POINTS);
        isTransitioningLeft.value = dest === PREV;
        left.x.value = withSpring(
            dest,
            {
                velocity: velocityX,
                overshootClamping: isTransitioningLeft.value ? true : false,
                restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
                restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
            },
            () => {
                if(isTransitioningLeft.value) {
                    runOnJS(setIndex)(index - 1);
                }else {
                    zindex.value = 0;
                    activeSide.value = Side.NONE;
                }
            }
        );
        left.y.value = withSpring(HEIGHT/2, { velocity: velocityY });
    }else if(activeSide.value === Side.RIGHT) {
        const dest = snapPoint(x, velocityX, LEFT_SNAP_POINTS);
        isTransitioningRight.value = dest === NEXT;
        right.x.value = withSpring(
           WIDTH - dest,
            {
                velocity: velocityX,
                overshootClamping: isTransitioningRight.value ? true : false,
                restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
                restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
            }, () => {
                if(isTransitioningRight.value) {
                    runOnJS(setIndex)(index + 1);
                }else {
                    activeSide.value = Side.NONE;
                }
            });
        right.y.value = withSpring(HEIGHT/2, { velocity: velocityY });
    }
});

const leftStyle = useAnimatedStyle(() => ({
    zIndex: zindex.value,
}));

useEffect(() => {
    if(Platform.OS === 'ios') {
        right.x.value = withSpring(WIDTH * .167);
    }else {
        right.x.value = withSpring(WIDTH * .185);
    }
}, [left, right]);

return (
    <GestureDetector gesture={pandGesture}>
      <Animated.View style={StyleSheet.absoluteFill}>
        {current}
        {prev && (
          <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
            <Wave
              side={Side.LEFT}
              position={left}
              isTransitioning={isTransitioningLeft}
            >
              {prev}
            </Wave>
          </Animated.View>
        )}
        {next && (
          <View style={StyleSheet.absoluteFill}>
            <Wave
              side={Side.RIGHT}
              position={right}
              isTransitioning={isTransitioningRight}
            >
              {next}
            </Wave>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  )
}

export default Slider