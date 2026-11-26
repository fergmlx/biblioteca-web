package com.biblioteca.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import java.sql.Connection;
import java.sql.SQLException;

public final class Database {
    private static final HikariDataSource DATA_SOURCE;

    static {
        try {
            HikariConfig config = new HikariConfig();
            Properties file = loadProperties();

            String url = setting("DB_URL", file.getProperty("DB_URL"));
            
            if (url == null || url.isBlank()) {
                String host = setting("DB_HOST", file.getProperty("DB_HOST", "localhost"));
                String port = setting("DB_PORT", file.getProperty("DB_PORT", "5432"));
                String name = setting("DB_NAME", file.getProperty("DB_NAME", "biblioteca"));
                String sslMode = setting("DB_SSLMODE", file.getProperty("DB_SSLMODE", "prefer"));
                url = "jdbc:postgresql://" + host + ":" + port + "/" + name + "?sslmode=" + sslMode;
            }
            
            config.setJdbcUrl(url);
            config.setUsername(setting("DB_USER", file.getProperty("DB_USER", "biblioteca_app")));
            config.setPassword(setting("DB_PASSWORD", file.getProperty("DB_PASSWORD")));
            config.setDriverClassName("org.postgresql.Driver");
            
            int maxPool = safeParseInt(setting("DB_POOL_MAX", file.getProperty("DB_POOL_MAX")), 5);
            int minIdle = safeParseInt(setting("DB_POOL_MIN", file.getProperty("DB_POOL_MIN")), 1);
            
            config.setMaximumPoolSize(maxPool);
            config.setMinimumIdle(minIdle);
            config.setPoolName("biblioteca-hikari");
            config.setConnectionTimeout(30000);
            
            DATA_SOURCE = new HikariDataSource(config);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ExceptionInInitializerError("Error crítico al inicializar el pool de HikariCP: " + e.getMessage());
        }
    }

    private Database() {}

    public static Connection getConnection() throws SQLException {
        if (DATA_SOURCE == null) {
            throw new SQLException("El Data Source no fue inicializado correctamente.");
        }
        return DATA_SOURCE.getConnection();
    }

    private static String setting(String name, String fallback) {
        String property = System.getProperty(name);
        if (property != null && !property.isBlank()) return property.trim();
        String environment = System.getenv(name);
        return (environment == null || environment.isBlank()) ? fallback : environment.trim();
    }

    private static int safeParseInt(String value, int fallback) {
        if (value == null || value.isBlank()) return fallback;
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private static Properties loadProperties() {
        Properties properties = new Properties();

        String configuredFile = setting("DB_CONFIG_FILE", null);
        if (configuredFile != null && !configuredFile.isBlank()) {
            loadPropertiesFile(properties, Paths.get(configuredFile));
            return properties;
        }

        try (InputStream input = Database.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (input != null) {
                properties.load(input);
                return properties;
            }
        } catch (IOException exception) {
            System.err.println("Advertencia: No se pudo cargar db.properties desde el classpath.");
        }

        loadPropertiesFile(properties, Paths.get(System.getProperty("user.dir"), "db.properties"));
        loadPropertiesFile(properties, Paths.get(System.getProperty("user.dir"), "backend", "db.properties"));
        
        return properties;
    }

    private static void loadPropertiesFile(Properties properties, Path path) {
        if (!Files.isRegularFile(path)) return;
        try (InputStream input = Files.newInputStream(path)) {
            properties.load(input);
        } catch (IOException exception) {
            System.err.println("No se pudo leer el archivo físico de configuración: " + path);
        }
    }

    public static void close() {
        if (DATA_SOURCE != null && !DATA_SOURCE.isClosed()) DATA_SOURCE.close();
    }
}
