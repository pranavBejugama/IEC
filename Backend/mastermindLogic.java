public class mastermindLogic {

    // Simple container for result
    public static class Score {
        public final int black;
        public final int white;

        public Score(int black, int white) {
            this.black = black;
            this.white = white;
        }

        @Override
        public String toString() {
            return "black: " + black + ", white: " + white;
        }
    }

    // secret and guess are same-length strings of digits '0'–'9'
    public static Score guessScore(String secret, String guess) {
        int n = secret.length();
        int black = 0;
        int white = 0;

        // Count of remaining digits (0–9) after removing blacks
        int[] secretCount = new int[10];
        int[] guessCount  = new int[10];

        // 1) Count black pegs
        for (int i = 0; i < n; i++) {
            char s = secret.charAt(i);
            char g = guess.charAt(i);
            if (s == g) {
                black++;
            } else {
                secretCount[s - '0']++;
                guessCount[g - '0']++;
            }
        }

        // 2) Count white pegs (correct digit, wrong position)
        for (int d = 0; d < 10; d++) {
            white += Math.min(secretCount[d], guessCount[d]);
        }

        return new Score(black, white);
    }
}
