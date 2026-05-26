using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ContactBook.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    MobilePhone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    JobTitle = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Contacts",
                columns: new[] { "Id", "BirthDate", "JobTitle", "MobilePhone", "Name" },
                values: new object[,]
                {
                    { 1, new DateOnly(1990, 3, 15), "Backend Developer", "+375291234567", "Алексей Петров" },
                    { 2, new DateOnly(1995, 7, 22), "UI/UX Designer", "+375339876543", "Мария Иванова" },
                    { 3, new DateOnly(1988, 11, 5), "Frontend Developer", "+375445551234", "Дмитрий Сидоров" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Contacts");
        }
    }
}
