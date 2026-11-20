package com.biblioteca.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public final class Database {
    private static final HikariDataSource DATA_SOURCE;

    static {
        HikariConfig config = new HikariConfig();
        String url = setting("DB_URL", null);
        if (url == null || url.isBlank()) {
            url = "jdbc:postgresql://" + setting("DB_HOST", "localhost") + ":"
                + setting("DB_PORT", "5432") + "/" + setting("DB_NAME", "biblioteca");
        }
        config.setJdbcUrl(url);
        config.setUsername(setting("DB_USER", "123"));
        config.setPassword(setting("DB_PASSWORD", "123"));
        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(Integer.parseInt(setting("DB_POOL_MAX", "10")));
        config.setMinimumIdle(Integer.parseInt(setting("DB_POOL_MIN", "2")));
        config.setPoolName("biblioteca-hikari");
        config.setConnectionTimeout(30000);
        DATA_SOURCE = new HikariDataSource(config);
    }

    private Database() {}

    public static Connection getConnection() throws SQLException {
        return DATA_SOURCE.getConnection();
    }

    private static String setting(String name, String fallback) {
        String property = System.getProperty(name);
        if (property != null && !property.isBlank()) return property;
        String environment = System.getenv(name);
        return environment == null || environment.isBlank() ? fallback : environment;
    }

    public static void close() {
        if (!DATA_SOURCE.isClosed()) DATA_SOURCE.close();
    }
}
