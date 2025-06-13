using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace DAL.Migrations
{
    /// <inheritdoc />
    public partial class added_Wishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailConfirmationToken");

            migrationBuilder.CreateTable(
                name: "CustomerRecordRelease",
                columns: table => new
                {
                    CustomersId = table.Column<int>(type: "integer", nullable: false),
                    ReleasesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerRecordRelease", x => new { x.CustomersId, x.ReleasesId });
                    table.ForeignKey(
                        name: "FK_CustomerRecordRelease_Customer_CustomersId",
                        column: x => x.CustomersId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerRecordRelease_RecordRelease_ReleasesId",
                        column: x => x.ReleasesId,
                        principalTable: "RecordRelease",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailToken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TokenHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailToken_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerRecordRelease_ReleasesId",
                table: "CustomerRecordRelease",
                column: "ReleasesId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailToken_CustomerId",
                table: "EmailToken",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailToken_TokenHash",
                table: "EmailToken",
                column: "TokenHash",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerRecordRelease");

            migrationBuilder.DropTable(
                name: "EmailToken");

            migrationBuilder.CreateTable(
                name: "EmailConfirmationToken",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Token = table.Column<Guid>(type: "uuid", nullable: false),
                    Used = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailConfirmationToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailConfirmationToken_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailConfirmationToken_CustomerId",
                table: "EmailConfirmationToken",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailConfirmationToken_Token",
                table: "EmailConfirmationToken",
                column: "Token",
                unique: true);
        }
    }
}
