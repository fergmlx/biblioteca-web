FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
COPY src ./src
RUN mvn -B -ntp package

FROM tomcat:11-jre21-temurin
COPY --from=build /src/target/biblioteca-backend.war /usr/local/tomcat/webapps/biblioteca-backend.war
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-ec", "sed -i \"s/port=\\\"8080\\\"/port=\\\"${PORT}\\\"/\" conf/server.xml; exec catalina.sh run"]
