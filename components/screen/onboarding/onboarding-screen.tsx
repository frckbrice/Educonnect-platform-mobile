import { onBoardingSlides } from '@/config/constants';
import React from 'react'
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Slider from './slider';
import Slide from './slide';



function Onboardingscreen() {

  const [index, setIndex] = React.useState(0);
  const prev = onBoardingSlides[index - 1];
  const next = onBoardingSlides[index + 1];

  return (
   <GestureHandlerRootView style={{ flex: 1 }}>
      <Slider
        key={index}
        index={index}
        setIndex={setIndex}
        prev={
          prev && (
            <Slide
              index={index}
              setIndex={setIndex}
              slide={prev}
              totalSlides={onBoardingSlides.length}
            />
          )
        }
        next={
          next && (
            <Slide
              index={index}
              setIndex={setIndex}
              slide={next}
              totalSlides={onBoardingSlides.length}
            />
          )
        }
      >
        <Slide 
          slide={onBoardingSlides[index]}
          totalSlides={onBoardingSlides.length}
          index={index}
          setIndex={setIndex}
        />
      </Slider>
   </GestureHandlerRootView>
  )
};

export default Onboardingscreen;
