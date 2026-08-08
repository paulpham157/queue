package com.example.leads;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class LeadRequest {

    @NotBlank
    @Size(max = 200)
    @Email
    private String email;

    @Size(max = 200)
    private String name;

    @Size(max = 200)
    private String company;

    @Size(max = 2_000)
    private String message;

    @Size(max = 50)
    private String source;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
