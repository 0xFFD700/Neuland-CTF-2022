import java.util.Scanner;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;

public class Log4Flag {
    public static void main(String[] array) {
        try {
            final Logger logger = LogManager.getLogger("Log4Flag");

            while (true) {
                System.out.println("Do you want the flag?");
                String input = new Scanner(System.in).next();

                if (input.toLowerCase().contains("yes") && input.toLowerCase().contains("please")) {
                    System.out.println("I won't give you the flag this easily!");
                    logger.error("Unauthorized access attempt with input: {}", (Object) input);
                } else if (input.toLowerCase().contains("yes")) {
                    System.out.println("Try Harder! <3");
                } else if (input.toLowerCase().contains("please")) {
                    System.out.println("Getting closer!");
                } else if (input.toLowerCase().contains("no")) {
                    System.out.println("What are you even doing here? :P");
                } else {
                    System.out.println("Try a different input!");
                }
                System.out.println("");
            }
        } catch (Exception x) {
            System.err.println(x);
        }
    }
}
