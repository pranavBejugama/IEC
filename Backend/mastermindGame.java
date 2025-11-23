import java.util.Random;

public class mastermindGame {

    private final String secretCode;
    private final int length;

    public mastermindGame(int length) {
        this.length = length;
        this.secretCode = generateSecretCode(length);
    }

    private String generateSecretCode(int length) {
        Random rand = new Random();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int digit = rand.nextInt(10); // 0–9
            code.append(digit);
        }

        return code.toString();
    }

    public mastermindLogic.Score guess(String guess) {
        return mastermindLogic.guessScore(secretCode, guess);
    }

    public String getSecretCode() {
        return secretCode;
    }

    public int getLength() {
        return length;
    }
}
