public class Lead {
    public String id;
    public String name;
    public String email;
    public String company;
    public String message;
    public String source;

    public Lead() {}

    public Lead(String id, String name, String email, String company,
                String message, String source) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.company = company;
        this.message = message;
        this.source = source;
    }
}