package com.example.movie_booking.config;


import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Configuration
public class VnPayConfig {

    @Value("${vnpay.tmnCode}")
    private String tmnCode;

    @Value("${vnpay.hashSecret}")
    private String hashSecret;

    @Value("${vnpay.url}")
    private String vnPayUrl;

    @Value("${vnpay.returnUrl}")
    private String vnPayReturnUrl;

    public String getTmnCode() {
        return tmnCode;
    }

    public String getHashSecret() {
        return hashSecret;
    }

    public String getVnPayUrl() {
        return vnPayUrl;
    }

    public String getVnPayReturnUrl() {
        return vnPayReturnUrl;
    }

    // Phương thức tạo chuỗi chữ ký (checksum) - giữ nguyên
    public String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac hmacSha512 = javax.crypto.Mac.getInstance("HmacSHA512");
            byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(keyBytes, "HmacSHA512");
            hmacSha512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] rawHmac = hmacSha512.doFinal(dataBytes);
            return bytesToHex(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Error while calculating HMACSHA512", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    // Phương thức tạo ra một OrderInfo duy nhất cho mỗi giao dịch - giữ nguyên
    public String getOrderId() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        return formatter.format(cld.getTime());
    }

    // Phương thức tạo chuỗi truy vấn URL an toàn - giữ nguyên
    public String encodeUrl(String s) {
        try {
            return URLEncoder.encode(s,StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Encoding not supported", e);
        }
    }

    // Sửa đổi lớp Builder
    // Đảm bảo Builder là một lớp public static nested class
    public static class Builder {
        private final Map<String, String> vnp_Params = new HashMap<>();
        private final String tmnCode;
        private final String hashSecret; // Lấy từ constructor
        private final String vnPayUrl;   // Lấy từ constructor

        // Tạo một instance của VnPayConfig để sử dụng các phương thức non-static
        // Hoặc truyền các phương thức cần thiết vào Builder
        private final VnPayConfig outerConfig; // Thêm tham chiếu đến thể hiện bên ngoài

        public Builder(VnPayConfig config) {
            this.tmnCode = config.getTmnCode();
            this.hashSecret = config.getHashSecret();
            this.vnPayUrl = config.getVnPayUrl();
            this.outerConfig = config; // Lưu tham chiếu đến VnPayConfig instance
            // this.vnPayReturnUrl = config.getVnPayReturnUrl(); // Không cần truyền vào Builder nếu nó là tham số vnp_Params

            vnp_Params.put("vnp_Version", "2.1.0");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_TmnCode", tmnCode);
            vnp_Params.put("vnp_ReturnUrl", config.getVnPayReturnUrl()); // Lấy ReturnUrl từ config
            vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // Hoặc lấy IP thực của người dùng
            vnp_Params.put("vnp_CurrCode", "VND");

        }

        public Builder withTxnRef(String txnRef) {
            vnp_Params.put("vnp_TxnRef", txnRef);
            return this;
        }

        public Builder withAmount(long amount) {
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
            return this;
        }

        public Builder withOrderInfo(String orderInfo) {
            vnp_Params.put("vnp_OrderInfo", orderInfo);
            return this;
        }

        public Builder withOrderType(String orderType) {
            vnp_Params.put("vnp_OrderType", orderType);
            return this;
        }

        public Builder withLocale(String locale) {
            vnp_Params.put("vnp_Locale", locale);
            return this;
        }

        public Builder withBankCode(String bankCode) {
            vnp_Params.put("vnp_BankCode", bankCode);
            return this;
        }

        public String buildPaymentUrl() {
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator itr = fieldNames.iterator();

            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(outerConfig.encodeUrl(fieldValue)); // Sử dụng outerConfig.encodeUrl

                    query.append(outerConfig.encodeUrl(fieldName)); // Sử dụng outerConfig.encodeUrl
                    query.append('=');
                    query.append(outerConfig.encodeUrl(fieldValue)); // Sử dụng outerConfig.encodeUrl
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = outerConfig.hmacSHA512(hashSecret, hashData.toString()); // Sử dụng outerConfig.hmacSHA512
            return vnPayUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnp_SecureHash;
        }
    }
}