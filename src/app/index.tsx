import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];

export default function HomeScreen() {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  function handleKey(key: string) {
    if (key === '⌫') {
      setAnswer(answer.slice(0, -1));
      setFeedback('');
      return;
    }

    if (key === 'OK') {
      setFeedback(answer === '12' ? 'Corect! 🎉' : 'Mai încearcă.');
      return;
    }

    setAnswer(answer + key);
    setFeedback('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aritmetică Mentală</Text>

      <Text style={styles.question}>7 + 5 = ?</Text>

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
    paddingTop: 80,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 55,
  },
  question: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 30,
  },
  answerBox: {
    width: 170,
    height: 75,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D9E2F0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answer: {
    fontSize: 38,
    fontWeight: '700',
  },
  feedback: {
    height: 40,
    marginTop: 16,
    fontSize: 22,
    fontWeight: '700',
  },
  keypad: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  key: {
    width: '30%',
    height: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D9E2F0',
  },
  okKey: {
    backgroundColor: '#2477F3',
  },
  keyText: {
    fontSize: 27,
    fontWeight: '700',
  },
  okText: {
    color: '#FFFFFF',
  },
});