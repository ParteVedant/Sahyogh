package com.sahyog.backend.model;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AmountBreakdown {
    private double base;
    private double fee;
    private double tax;
    private double total;

    public AmountBreakdown() {}

    public AmountBreakdown(double base, double fee, double tax, double total) {
        this.base = base;
        this.fee = fee;
        this.tax = tax;
        this.total = total;
    }

    public double getBase() {
        return base;
    }

    public void setBase(double base) {
        this.base = base;
    }

    public double getFee() {
        return fee;
    }

    public void setFee(double fee) {
        this.fee = fee;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
