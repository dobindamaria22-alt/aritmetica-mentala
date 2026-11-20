import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const exercises = [
  { question: '7 + 5', answer: '12' },
  { question: '9 + 4', answer: '13' },
  { question: '15 - 7', answer: '8' },
  { question: '8 + 6', answer: '14' },
  { question: '17 - 9', answer: '8' },
];

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];

export default function HomeScreen() {
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [finished, setFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [skillStrengthened, setSkillStrengthened] = useState(false);
  const [showWow, setShowWow] = useState(false);

  const glow = useRef(new Animated.Value(0)).current;

  const exercise = exercises[exerciseIndex];

  function triggerSkillMoment() {
    setSkillStrengthened(true);
    setShowWow(true);

    glow.setValue(0);

    Animated.sequence([
      Animated.timing(glow, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 0.4,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowWow(false);
    }, 3000);
  }

  function handleKey(key: string) {
    if (finished) return;

    if (key === '⌫') {
      setAnswer(answer.slice(0, -1));
      setFeedback('');
      return;
    }

    if (key === 'OK') {
      if (answer === exercise.answer) {
        const newCorrectCount = correctCount + 1;

        setCorrectCount(newCorrectCount);
        setFeedback('Corect! 🎉');

        if (newCorrectCount === 3 && !skillStrengthened) {
          triggerSkillMoment();
        }

        setTimeout(() => {
          if (exerciseIndex === exercises.length - 1) {
            setFinished(true);
            setFeedback('');
          } else {
            setExerciseIndex(exerciseIndex + 1);
            setAnswer('');
            setFeedback('');
          }
        }, newCorrectCount === 3 ? 3200: 600);
      } else {
        setFeedback('Mai exersăm puțin.');
      }

      return;
    }

    if (answer.length < 3) {
      setAnswer(answer + key);
    }

    setFeedback('');
  }

  if (finished) {
    return (
      <View style={styles.finishedContainer}>
        <Text style={styles.finishedBrain}>
          🧠 {skillStrengthened ? '✨' : ''}
        </Text>

        <Text style={styles.finishedTitle}>Misiune terminată! 🎉</Text>

        <Text style={styles.finishedText}>
          Ai rezolvat 5 exerciții.
        </Text>

        {skillStrengthened && (
          <Text style={styles.finishedSkill}>
            Ai întărit o abilitate!
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
<Text style={styles.missionTitle}>Misiunea de azi</Text>

<View style={styles.progressBar}>
  <View
    style={[
      styles.progressFill,
      {
        width: `${((exerciseIndex + 1) / exercises.length) * 100}%`,
      },
    ]}
  />
</View>

<Text style={styles.missionProgress}>
  {exerciseIndex + 1} din {exercises.length}
</Text>
      <View style={styles.mindyArea}>
        
        <Animated.View
  style={{
    transform: [
      {
        scale: glow.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  }}
>
  <Image
    source={require('../../assets/images/mindy.png')}
    style={styles.mindyImage}
    resizeMode="contain"
  />
</Animated.View>  

        <Text style={styles.mindyName}>
          Mindy {skillStrengthened ? '✨' : ''}
        </Text>
      </View>

      {showWow && (
        <View style={styles.wowBox}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={styles.wowText}>Ai întărit o abilitate!</Text>
          <Text style={styles.wowSubtext}>
            Exersând, creierul tău devine mai puternic.
          </Text>
        </View>
      )}

      <Text style={styles.progress}>
        
      </Text>

      <Text style={styles.question}>
        {exercise.question} = ?
      </Text>

      <View style={styles.answerBox}>
        <Text style={styles.answer}>{answer}</Text>
      </View>

      <Text style={styles.feedback}>{feedback}</Text>

      <View style={styles.keypad}>
        {keys.map((key) => (
          <Pressable
            key={key}
            onPress={() => handleKey(key)}
            style={[styles.key, key === 'OK' && styles.okKey]}
          >
            <Text style={[styles.keyText, key === 'OK' && styles.okText]}>
              {key}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    alignItems: 'center',
    paddingTop: 38,
    paddingHorizontal: 28,
  },missionTitle: {
  fontSize: 26,
  fontWeight: '800',
  marginBottom: 12,
},
progressBar: {
  width: '100%',
  height: 12,
  backgroundColor: '#E4EAF3',
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: 6,
},
progressFill: {
  height: '100%',
  backgroundColor: '#2477F3',
  borderRadius: 10,
},
missionProgress: {
  fontSize: 15,
  fontWeight: '600',
  marginBottom: 10,
},
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  mindyImage: {
  width: 135,
  height: 135,
  },

  mindyArea: {
    alignItems: 'center',
    marginBottom: 8,
  },
  mindyBrain: {
    fontSize: 52,
  },
  mindyName: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  wowBox: {
    width: '100%',
    backgroundColor: '#FFF7D6',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#FFD95A',
  },
  sparkle: {
    fontSize: 34,
  },
  wowText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  wowSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  progress: {
    fontSize: 16,
    marginBottom: 12,
  },
  question: {
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 16,
  },
  answerBox: {
    width: 165,
    height: 68,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D9E2F0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answer: {
    fontSize: 36,
    fontWeight: '700',
  },
  feedback: {
    height: 32,
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
  },
  keypad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  key: {
    width: '30%',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9E2F0',
  },
  okKey: {
    backgroundColor: '#2477F3',
  },
  keyText: {
    fontSize: 25,
    fontWeight: '700',
  },
  okText: {
    color: '#FFFFFF',
  },
  finishedContainer: {
    flex: 1,
    backgroundColor: '#F7FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  finishedBrain: {
    fontSize: 72,
    marginBottom: 16,
  },
  finishedTitle: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 14,
  },
  finishedText: {
    fontSize: 20,
    textAlign: 'center',
  },
  finishedSkill: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 18,
    textAlign: 'center',
  },
});