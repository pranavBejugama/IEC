import java.util.Scanner;

public class main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        mastermindGame game = new mastermindGame(4); // you can change length

        System.out.println("=== Mastermind (Digits 0–9) ===");
        System.out.println("Secret code generated (length " + game.getLength() + ")");
        System.out.println("Enter your guess, e.g., 1234");

        while (true) {
            System.out.print("\nYour guess: ");
            String guess = sc.nextLine();

            if (guess.length() != game.getLength()) {
                System.out.println("Guess must be " + game.getLength() + " digits long.");
                continue;
            }

            mastermindLogic.Score score = game.guess(guess);
            System.out.println("Result → " + score);

            if (score.black == game.getLength()) {
                System.out.println("🎉 You cracked the code!");
                System.out.println("Secret was: " + game.getSecretCode());
                break;
            }
        }

        sc.close();
    }
}
