import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const exercises = [
  { question: '7 + 5 = ?', answer: '12' },
  { question: '6 + 7 = ?', answer: '13' },
  { question: '3 + 5 = ?', answer: '8' },
  { question: '8 + 6 = ?', answer: '14' },
  { question: '4 + 4 = ?', answer: '8' },
];

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const usableHeight = height - insets.top - insets.bottom;

  const isTablet = width >= 700;
  const isCompact = usableHeight < 760;

  const contentWidth = Math.min(width - 28, isTablet ? 560 : 430);

  const mindySize = isTablet ? 150 : isCompact ? 88 : 105;
  const questionSize = isTablet ? 54 : isCompact ? 36 : 42;
  const keyHeight = isTablet ? 68 : isCompact ? 47 : 52;
  const keyFontSize = isTablet ? 30 : isCompact ? 22 : 24;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSkillMessage, setShowSkillMessage] = useState(false);
  const [locked, setLocked] = useState(false);

  const glow = useRef(new Animated.Value(0)).current;
  const sparkleY = useRef(new Animated.Value(25)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;

  const exercise = exercises[exerciseIndex];

  const progressWidth = `${
    ((exerciseIndex + 1) / exercises.length) * 100
  }%` as `${number}%`;

  function triggerSkillMoment() {
    setShowSkillMessage(true);

    glow.setValue(0);
    sparkleY.setValue(25);
    sparkleOpacity.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleY, {
          toValue: -65,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),

        Animated.timing(sparkleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setTimeout(() => {
      setShowSkillMessage(false);
    }, 3000);
  }

  function handleKey(key: string) {
    if (finished || locked) return;

    if (key === '⌫') {
      setAnswer(answer.slice(0, -1));
      setFeedback('');
      return;
    }

    if (key === 'OK') {
      if (answer === exercise.answer) {
        setLocked(true);
        setFeedback('Corect! 🎉');

        const newCorrectCount = correctCount + 1;
        setCorrectCount(newCorrectCount);

        const isSkillMoment = newCorrectCount === 3;

        if (isSkillMoment) {
          triggerSkillMoment();
        }

        setTimeout(
          () => {
            if (exerciseIndex === exercises.length - 1) {
              setFinished(true);
              setFeedback('');
            } else {
              setExerciseIndex(exerciseIndex + 1);
              setAnswer('');
              setFeedback('');
              setLocked(false);
            }
          },
          isSkillMoment ? 3200 : 600
        );

        return;
      }

      setLocked(true);
      setFeedback('Mai exersăm puțin.');
      setTimeout(() => {
        setAnswer('');
        setFeedback('');
        setLocked(false);
      }, 900);
      return;
    }

    if (answer.length < 3) {
      setAnswer(answer + key);
      setFeedback('');
    }
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.finishedContainer}>
          <Image
            source={require('../../assets/images/mindy.png')}
            style={{
              width: isTablet ? 220 : 165,
              height: isTablet ? 220 : 165,
            }}
            resizeMode="contain"
          />

          <Text style={styles.finishedTitle}>Misiune terminată! 🎉</Text>

          <Text style={styles.finishedText}>
            Ai terminat cele 5 exerciții de azi.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.screen,
          {
            width: contentWidth,
            paddingBottom: Math.max(8, insets.bottom),
          },
        ]}
      >
        <View style={styles.headerArea}>
          <Text
            style={[
              styles.missionTitle,
              {
                fontSize: isTablet ? 30 : isCompact ? 21 : 25,
              },
            ]}
          >
            Misiunea de azi
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>

          <Text style={styles.missionProgress}>
            {exerciseIndex + 1} din {exercises.length}
          </Text>
        </View>

        <View style={styles.mindyArea}>
          <Animated.Text
            style={[
              styles.sparkle,
              {
                opacity: sparkleOpacity,
                transform: [{ translateY: sparkleY }],
              },
            ]}
          >
            ✨
          </Animated.Text>

          <Animated.View
            style={{
              transform: [
                {
                  scale: glow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.16],
                  }),
                },
              ],
            }}
          >
            <Image
              source={require('../../assets/images/mindy.png')}
              style={{
                width: mindySize,
                height: mindySize,
              }}
              resizeMode="contain"
            />
          </Animated.View>

          <Text
            style={[
              styles.mindyName,
              {
                fontSize: isTablet ? 22 : 18,
              },
            ]}
          >
            Mindy
          </Text>
        </View>

        {showSkillMessage && (
          <View style={styles.skillCard}>
            <Text style={styles.skillTitle}>
              ✨ Ai întărit o abilitate!
            </Text>

            <Text style={styles.skillText}>
              Exersând, creierul tău devine mai puternic.
            </Text>
          </View>
        )}

        <View style={styles.exerciseArea}>
          <Text
            style={[
              styles.question,
              {
                fontSize: questionSize,
              },
            ]}
          >
            {exercise.question}
          </Text>

          <View
            style={[
              styles.answerBox,
              {
                height: isCompact ? 54 : 64,
              },
            ]}
          >
            <Text style={styles.answer}>{answer}</Text>
          </View>

          <Text style={styles.feedback}>{feedback}</Text>
        </View>

        <View style={styles.keypad}>
          {keys.map((key) => (
            <Pressable
              key={key}
              onPress={() => handleKey(key)}
              style={[
                styles.key,
                {
                  height: keyHeight,
                },
                key === 'OK' && styles.okKey,
              ]}
            >
              <Text
                style={[
                  styles.keyText,
                  {
                    fontSize: keyFontSize,
                  },
                  key === 'OK' && styles.okText,
                ]}
              >
                {key}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFF',
  },

  screen: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingTop: 4,
  },

  headerArea: {
    alignItems: 'center',
    flexShrink: 0,
  },

  missionTitle: {
    fontWeight: '800',
    marginBottom: 7,
  },

  progressBar: {
    width: '100%',
    height: 9,
    backgroundColor: '#E4EAF3',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2477F3',
    borderRadius: 10,
  },

  missionProgress: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  mindyArea: {
    alignItems: 'center',
    position: 'relative',
    marginTop: 2,
    flexShrink: 0,
  },

  mindyName: {
    fontWeight: '800',
    marginTop: -3,
  },

  sparkle: {
    position: 'absolute',
    bottom: 8,
    zIndex: 5,
    fontSize: 30,
  },

  skillCard: {
    alignSelf: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: '#FFF7D6',
    alignItems: 'center',
    width: '92%',
    maxWidth: 340,
  },

  skillTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

  skillText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },

  exerciseArea: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
    flexShrink: 0,
  },

  question: {
    fontWeight: '800',
    marginBottom: 9,
  },

  answerBox: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D9E2F0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  answer: {
    fontSize: 32,
    fontWeight: '700',
  },

  feedback: {
    height: 25,
    marginTop: 4,
    fontSize: 17,
    fontWeight: '700',
  },

  keypad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 'auto',
    flexShrink: 0,
  },

  key: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
    borderWidth: 1,
    borderColor: '#D9E2F0',
  },

  okKey: {
    backgroundColor: '#2477F3',
  },

  keyText: {
    fontWeight: '700',
  },

  okText: {
    color: '#FFFFFF',
  },

  finishedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  finishedTitle: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 10,
  },

  finishedText: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
  },
});